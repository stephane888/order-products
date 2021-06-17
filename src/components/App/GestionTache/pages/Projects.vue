<template>
  <div>
    Liste de projets.

    <div class="d-flex">
      <div v-for="project in crumb" :key="project.idcontents" class="mr-2">
        <a href="#" v-html="project.titre" @click="select_project(project)">
        </a>
        >
      </div>
    </div>
    <cards-jsx
      :projects="projects_cards"
      @ev_select_project="select_project"
      @ev_add_tache="add_tache"
      @ev_edit="edit"
      @ev_delete_project="delete_project"
      @ev_edit_style="edit_style"
      @ev_edit_ressources="edit_ressources"
      @ev_edit_timer="edit_timer"
      class="row"
    >
    </cards-jsx>
    <!-- Modal pour l'edition et l'ajout de projet. -->
    <modal-slot :id_modal="formated_id_modal">
      <template v-slot:modal_header>
        <span v-html="modal_title"></span>
      </template>
      <builder-forms
        ref="builderformsedit"
        :forms="formated_forms_edit"
        :show_submit="true"
        :form_contain_class="'w-100 '"
        :form_class="'row-0'"
        :is_running="template_edit_is_runing"
        @ev_builder_forms="ev_builder_forms"
      ></builder-forms>
    </modal-slot>

    <!-- Modal pour la confirmation de suppresion. -->
    <modal-confirm-delete
      :id_modal="formated_id_modal_delete"
      :datas_modal_body="modal_body"
      :modal_title="modal_title_delete"
      @ev_confirm_delete="confirm_delete"
      @ev_cancel="close_modal_delete"
    >
    </modal-confirm-delete>

    <!-- Modal pour edition du style. -->
    <modal-slot :id_modal="formated_id_modal_style">
      <template v-slot:modal_header>
        <span v-html="modal_title_style"></span>
      </template>
      <builder-forms
        ref="builderformsedit"
        :forms="formated_forms_edit_style"
        :show_submit="true"
        :form_contain_class="'w-100 '"
        :form_class="'row-0'"
        :is_running="template_edit_is_runing"
        @ev_builder_forms="ev_builder_forms_style"
      >
      </builder-forms>
    </modal-slot>

    <!-- Modal pour edition du timer. -->
    <modal-slot :id_modal="formated_id_modal_timer">
      <template v-slot:modal_header>
        <div class="d-flex align-items-center bloc-with-button">
          <div class="bloc-datas">
            <h5 class="modal-title ">Gerer du timers</h5>
            <i><small v-html="modal_title_style"></small></i>
          </div>
        </div>
      </template>
      <b-form ref="builderformsedit" @submit.prevent="ev_builder_forms_timer">
        <b-row>
          <b-col sm="6">
            <div class="form-group" :timer_debut="timer_debut">
              <label for="timepicker-invalid">
                Date debut
              </label>
              <b-form-datepicker
                locale="fr"
                v-model="timer_date_debut"
              ></b-form-datepicker>
            </div>
            <div class="form-group">
              <label for="timepicker-invalid">
                Heure debut
              </label>
              <b-form-timepicker
                locale="fr"
                v-model="timer_heure_debut"
              ></b-form-timepicker>
            </div>
            <hr />
            <div class="form-group">
              <label for="timepicker-invalid">
                Date de FIN.
              </label>
              <div>
                <div>
                  Durée de la tache :
                  <span v-html="duree_execution_reel"></span>
                </div>
                <div>
                  Heure debut de la tache :
                  <span v-html="timers.timedebut"></span>
                </div>
                <div>
                  Heure d'arret de la tache :
                  <span v-html="timers.timefin"></span>
                </div>
              </div>
            </div>
          </b-col>
          <b-col sm="6">
            <div class="form-group">
              <label for="timepicker-invalid">
                Durée d'execution (setp 5mn)
              </label>
              <b-input-group>
                <b-form-input
                  type="number"
                  v-model="timers.duree_execution"
                  @update="duree_execution_MAJ"
                  debounce="1500"
                  step="5"
                  :required="true"
                >
                </b-form-input>
                <template #append>
                  <b-input-group-text>
                    <strong class="text-primary"> Minites </strong>
                  </b-input-group-text>
                </template>
              </b-input-group>
            </div>
            <div class="form-group">
              <label for="timepicker-invalid">
                Tache encours
              </label>

              <b-form-checkbox v-model="timers.status" size="md" switch>
                Activé le compteur
              </b-form-checkbox>
            </div>
            <div class="form-group">
              <label for="timepicker-invalid">
                Staus de la tache
              </label>
              <b-form-checkbox
                v-model="timers.status_execution"
                size="md"
                switch
              >
                Tache terminer
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col> </b-col>
        </b-row>
        <div class="d-flex justify-content-end">
          <b-button type="submit" variant="outline-success" size="sm">
            Enregistrer
          </b-button>
        </div>
      </b-form>
    </modal-slot>

    <!-- Modal pour edition des ressources. -->
    <modal-slot :id_modal="formated_id_modal_ressource">
      <template v-slot:modal_header>
        <div class="d-flex align-items-center bloc-with-button">
          <div class="bloc-datas">
            <h5 class="modal-title ">Gerer les ressources</h5>
            <i><small v-html="modal_title_style"></small></i>
          </div>
          <span
            class="btn btn-outline-primary bloc-button"
            @click="add_bloc_ressources"
          >
            +
          </span>
        </div>
      </template>
      <builder-forms
        ref="builderformsedit"
        :forms="formated_forms_edit_ressources"
        :show_submit="true"
        :form_contain_class="'w-100 '"
        :form_class="'row-0'"
        @ev_builder_forms="ev_builder_forms_ressources"
      >
        <template v-slot:form_bottom>
          <div class="accordion" role="tablist">
            <b-card
              no-body
              class="mb-1"
              v-for="(ressource, index) in ressources"
              :key="index"
            >
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  block
                  v-b-toggle="'accordion' + index"
                  variant="primary"
                >
                  {{ ressource.category.value }}
                  <b-badge variant="light" class="float-left">{{
                    index + 1
                  }}</b-badge>
                </b-button>
              </b-card-header>
              <b-collapse
                :id="'accordion' + index"
                visible
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <div class="d-flex align-items-start bloc-with-button">
                    <div class="bloc-datas">
                      <input-text
                        label="Categorie"
                        :input="ressource.category"
                      ></input-text>
                      <input-files
                        :input="ressource.ressources_files"
                      ></input-files>
                    </div>
                    <span
                      class=" bloc-button btn btn-outline-danger"
                      @click="remove_bloc_ressources(index)"
                    >
                      <i class="fas fa-trash"></i>
                    </span>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </template>
      </builder-forms>
    </modal-slot>
    ressources
    <pre class="d-none">
      {{ ressources }}
    </pre>
    <!-- test rendu -->
    <!--
    <div class="p-5 border">
      <test-rendu-jsx-card
        :projects="projects_cards"
        @ev_select_project="select_project"
        @ev_add_tache="add_tache"
      >
      </test-rendu-jsx-card>
    </div>
  --></div>
</template>

<script>
/**
 * Jquery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}
//
/*
const notification = {
  title: "Your title",
  options: {
    body: "This is an example!"
  },
  events: {
    onerror: function() {
      console.log("Custom error event was called");
    },
    onclick: function() {
      console.log("Custom click event was called");
    },
    onclose: function() {
      console.log("Custom close event was called");
    },
    onshow: function() {
      console.log("Custom show event was called");
    }
  }
};
/**/
import CardsJSX from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/CardsJSX.vue";
import ModalSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSlot.vue";
import ModalConfirmDelete from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalConfirmDelete.vue";
import InputFiles from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputFiles.vue";
import InputText from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputText.vue";

//import TestRenduJSX_Card from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/TestRenduJSX/TestRenduJSX_Card0.vue";
/**
 * Permet de definir le model par defaut pour gerer les ressources.
 */
var defaultImages = function() {
  return {
    category: {
      value: "Reference"
    },
    description: {
      value: ""
    },
    ressources_files: {
      value: []
    }
  };
};
var defaultTimers = function() {
  return {
    timedebut: "",
    timefin: "",
    duree_execution: "",
    status_execution: false,
    status: true
  };
};
export default {
  name: "Projects",
  props: {
    projects: { type: [Array, Object] },
    projects_cards: {
      type: [Array, Object]
    },
    crumb: {
      type: [Array, Object]
    },
    template_edit_is_runing: {
      type: Boolean
    }
  },
  data() {
    return {
      id_modal: "create-tache",
      modal_title: "",
      modal_title_delete: "",
      modal_title_style: "",
      formated_forms_edit: [],
      formated_forms_edit_style: [],
      formated_forms_edit_ressources: [],
      /**
       *  Contient le project selectionner
       */
      project: [],
      /**
       * Contient l'id du contenu selectionner au niveau du modal.
       */
      modal_content_id: "",
      modal_body: {},
      ressources: [defaultImages()],
      /**
       * Timers blocs.
       */
      timer_date_debut: this.$moment().format("YYYY-MM-DD"),
      timer_heure_debut: this.$moment().format("HH:mm:ss"),
      //timer_debut: "",

      //timer_fin: "",
      timers: defaultTimers(),
      /**
       * Temps désactivée.
       */
      off_times: [
        { hd: 7, md: 0, hf: 8, mf: 0 },
        { hd: 13, md: 0, hf: 14, mf: 0 },
        { hd: 18, md: 0, hf: 19, mf: 0 }
      ],
      /**
       * Incremente le temps tous les 5 mn.
       */
      increment_time: 5,
      increment_music: 2
    };
  },
  mounted() {
    //var self = this;
  },
  components: {
    "modal-slot": ModalSlot,
    "cards-jsx": CardsJSX,
    "modal-confirm-delete": ModalConfirmDelete,
    "input-files": InputFiles,
    "input-text": InputText
  },
  methods: {
    duree_execution_MAJ() {
      this.determineLaDateDefin();
    },

    async determineLaDateDefin() {
      if (this.timers.duree_execution && this.timers.duree_execution !== "") {
        var date = await this.valideHeureDeFinition();

        if (date.isValid()) {
          this.timers.timefin = date.format("YYYY-MM-DD HH:mm:ss");
        }
        //console.log("determineLaDateDefin END", date);
      }
    },
    async valideHeureDeFinition() {
      let dateDebut = this.$moment(
        this.timers.timedebut,
        "YYYY-MM-DD HH:mm:ss"
      );
      let duree_execution = this.timers.duree_execution;
      for (var i = 0; i <= duree_execution; i = i + this.increment_time) {
        dateDebut.add(this.increment_time, "minutes");
        /*
        console.log(
          "valideHeureDeFinition : ",
          i,
          "\n",
          dateDebut.format("YYYY-MM-DD HH:mm:ss")
        );
        /**/
        dateDebut = await this.check_off_times(dateDebut);
        dateDebut = dateDebut.date;
      }
      //console.log("valideHeureDeFinition dateDebut : ", dateDebut);
      return dateDebut;
    },
    check_off_times(dateDebut) {
      var self = this;
      var date_string = dateDebut.format("YYYY-MM-DD HH:mm:ss");
      //console.log("date_string : ", date_string);
      return new Promise(resolve => {
        var mindate_off_time = function(date_string, off_time) {
          return self
            .$moment(date_string, "YYYY-MM-DD HH:mm:ss")
            .set("hour", off_time.hd)
            .set("minute", off_time.md);
        };
        var maxdate_off_time = function(date_string, off_time) {
          return self
            .$moment(date_string, "YYYY-MM-DD HH:mm:ss")
            .set("hour", off_time.hf)
            .set("minute", off_time.mf);
        };
        if (self.off_times.length > 0) {
          for (const i in self.off_times) {
            var minDate = mindate_off_time(date_string, self.off_times[i]);
            var maxDate = maxdate_off_time(date_string, self.off_times[i]);
            /*
            console.log(
              "check_off_times : ",
              minDate.format("YYYY-MM-DD HH:mm:ss"),
              "\n",
              maxDate.format("YYYY-MM-DD HH:mm:ss"),
              "\n diff min : ",
              dateDebut.diff(minDate, "m"),
              "\n diff max : ",
              dateDebut.diff(maxDate, "m")
            );
            /**/
            if (
              dateDebut.diff(minDate, "m") > 0 &&
              dateDebut.diff(maxDate, "m") < 0
            ) {
              console.log("this.off_times[i] : ", self.off_times[i]);
              resolve({
                date: maxDate
              });
              return true;
            }
            let j = parseInt(i) + 1;
            if (j == self.off_times.length) {
              resolve({ date: dateDebut });
              return true;
            }
          }
        } else {
          resolve({ date: dateDebut });
        }
      });
    },
    add_tache(project) {
      var datas = project.project;
      this.open_modal(datas.titre, datas.idcontents, datas.level);
    },
    open_modal(titre, idcontents, level, project = []) {
      var self = this;
      this.modal_title = "Ajouter une tache ou groupe de tache : " + titre;
      $("#" + self.formated_id_modal).modal("show");
      $("#" + self.formated_id_modal).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal).off("shown.bs.modal");
        self.buildform(idcontents, level, project);
        self.modal_content_id = project.idcontents;
      });
    },
    open_modal_delete(titre, project = []) {
      var self = this;
      this.modal_title_delete = "Confirmer la suppression de : " + titre;
      this.modal_body = project;
      $("#" + self.formated_id_modal_delete).modal("show");
      $("#" + self.formated_id_modal_delete).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal_delete).off("shown.bs.modal");
        self.modal_content_id = project.idcontents;
      });
    },
    open_modal_style(titre, project = []) {
      var self = this;
      this.modal_title_style = titre;
      $("#" + self.formated_id_modal_style).modal("show");
      $("#" + self.formated_id_modal_style).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal_style).off("shown.bs.modal");
        self.buildformStyle(project);
        self.modal_content_id = project.idcontents;
      });
    },
    open_modal_ressources(titre, project = []) {
      var self = this;
      this.modal_title_style = titre;
      $("#" + self.formated_id_modal_ressource).modal("show");
      $("#" + self.formated_id_modal_ressource).on(
        "shown.bs.modal",
        function() {
          $("#" + self.formated_id_modal_ressource).off("shown.bs.modal");
          self.modal_content_id = project.idcontents;
        }
      );
    },
    open_modal_timer(titre, project = []) {
      var self = this;
      this.modal_title_style = titre;
      $("#" + self.formated_id_modal_timer).modal("show");
      $("#" + self.formated_id_modal_timer).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal_timer).off("shown.bs.modal");
        self.modal_content_id = project.idcontents;
        self.timers = defaultTimers();
        self.timer_date_debut = self.$moment().format("YYYY-MM-DD");
        self.timer_heure_debut = self.$moment().format("HH:mm:ss");
        self.load_timers();
      });
    },
    load_timers() {
      this.$emit("ev_index", {
        token: "loader_timer",
        idcontents: this.modal_content_id
      });
    },
    close_modal() {
      var self = this;
      $("#" + self.formated_id_modal).modal("hide");
    },
    close_modal_delete() {
      var self = this;
      $("#" + self.formated_id_modal_delete).modal("hide");
    },
    close_modal_style() {
      var self = this;
      $("#" + self.formated_id_modal_style).modal("hide");
    },
    close_modal_ressource() {
      var self = this;
      $("#" + self.formated_id_modal_ressource).modal("hide");
    },
    close_modal_timer() {
      var self = this;
      $("#" + self.formated_id_modal_timer).modal("hide");
    },
    ev_builder_forms(datas) {
      if (datas.idcontentsparent) {
        this.$emit("ev_index", {
          create_tache: datas
        });
      } //
      else if (datas.idcontents) {
        this.$emit("ev_index", {
          update_tache: datas
        });
      }
    },
    ev_builder_forms_style(datas) {
      console.log("ev_builder_forms_style", datas);
      this.$emit("ev_index", {
        "create-update_style": datas
      });
    },
    add_bloc_ressources() {
      this.ressources.push(defaultImages());
    },
    remove_bloc_ressources(index) {
      this.ressources.splice(index, 1);
    },
    ev_builder_forms_ressources() {
      this.$emit("ev_index", {
        "create-update_ressources": this.ressources,
        idcontents: this.modal_content_id
      });
    },
    ev_builder_forms_timer() {
      this.$emit("ev_index", {
        "create-update_timer": this.timers,
        idcontents: this.modal_content_id
      });
      this.close_modal_timer();
    },
    select_project(project) {
      document.title = project.titre;
      this.project = project;
      this.modal_content_id = project.idcontents;
      localStorage.setItem("project", JSON.stringify(project));
      this.$emit("ev_index", {
        load_project: project
      });
    },
    edit(project) {
      var datas = project.project;
      this.open_modal(datas.titre, datas.idcontents, datas.level, datas);
    },
    delete_project(project) {
      project = project.project;
      this.open_modal_delete(project.titre, project);
    },
    confirm_delete(datas) {
      this.$emit("ev_index", {
        confirm_delete: datas
      });
    },
    edit_style(project) {
      project = project.project;
      this.open_modal_style(project.titre, project);
    },
    edit_ressources(project) {
      project = project.project;
      this.open_modal_ressources(project.titre, project);
    },
    edit_timer(project) {
      project = project.project;
      this.open_modal_timer(project.titre, project);
    },
    buildformStyle(project) {
      //console.log("buildformStyle", project);
      var configs = {};
      if (project.testconfigs) {
        configs = JSON.parse(project.testconfigs);
      }
      this.formated_forms_edit_style = [
        {
          template: "input-text",
          input: {
            value: project.idcontents
          },
          label: "idcontents",
          name: "idcontents",
          rules: "required",
          classe: "d-none"
        },
        {
          template: "input-text",
          input: {
            value: project.idconfigs
          },
          label: "idconfigs",
          name: "idconfigs",
          classe: "d-none"
        },
        {
          template: "input-text",
          input: {
            value: configs.class_card ? configs.class_card : ""
          },
          label: "Class card",
          name: "class_card"
        },
        {
          template: "input-text",
          input: {
            value: configs.container_class_card
              ? configs.container_class_card
              : ""
          },
          label: "Class container_class_card",
          name: "container_class_card"
        },
        {
          template: "input-text",
          input: {
            value: configs.class_card_body ? configs.class_card_body : ""
          },
          label: "Class card body",
          name: "class_card_body"
        }
      ];
    },
    buildform(idcontents, level, project) {
      if (project.titre) {
        this.formated_forms_edit = [
          {
            template: "input-text",
            input: {
              value: idcontents
            },
            label: "idcontents",
            name: "idcontents",
            rules: "required",
            classe: "d-none"
          },
          {
            template: "input-text",
            input: {
              value: project.level
            },
            label: "level",
            name: "level",
            rules: "required",
            classe: "d-none"
          },
          {
            template: "input-text",
            input: {
              value: project.titre
            },
            label: "Nom de la tache",
            name: "titre",
            rules: "required"
          },
          {
            template: "input-textarea-html",
            input: {
              value: project.text
            },
            label: "Description de la tache",
            name: "text"
          }
        ];
      } else {
        level = parseInt(level) + 1;
        this.formated_forms_edit = [
          {
            template: "input-text",
            input: {
              value: idcontents
            },
            label: "idcontentsparent",
            name: "idcontentsparent",
            rules: "required",
            classe: "d-none"
          },
          {
            template: "input-text",
            input: {
              value: level
            },
            label: "level",
            name: "level",
            rules: "required",
            classe: "d-none"
          },
          {
            template: "input-text",
            input: {
              value: ""
            },
            label: "Nom de la tache",
            name: "titre",
            rules: "required"
          },
          {
            template: "input-textarea-html",
            input: {
              value: ""
            },
            label: "Description de la tache",
            name: "text"
          }
        ];
      }
    },
    set_timer_debut(date) {
      this.timers.timedebut = date.format("YYYY-MM-DD HH:mm:ss");
      this.determineLaDateDefin();
    }
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-" + this.id_modal;
      }
    },
    formated_id_modal_delete: {
      get() {
        return "model-delete-" + this.id_modal;
      }
    },
    formated_id_modal_style: {
      get() {
        return "model-style-" + this.id_modal;
      }
    },
    formated_id_modal_ressource: {
      get() {
        return "model-ressource-" + this.id_modal;
      }
    },
    formated_id_modal_timer: {
      get() {
        return "model-timer-" + this.id_modal;
      }
    },
    timer_debut: {
      get() {
        var date = this.$moment(
          this.timer_date_debut + " " + this.timer_heure_debut,
          "YYYY-MM-DD HH:mm:ss"
        );
        this.set_timer_debut(date);
        return date;
      }
    },
    duree_execution_reel: {
      get() {
        if (this.timers.duree_execution) {
          var heures = Math.floor(this.timers.duree_execution / 60);
          var minutes_restante = this.timers.duree_execution % 60;
          return heures + "h" + minutes_restante;
        }
        return "";
      }
    }
  }
};
</script>
<style lang="scss">
.custom-switch {
  min-height: 39px;
}
</style>

<!--
    /siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/pages/Projects.vue
-->
