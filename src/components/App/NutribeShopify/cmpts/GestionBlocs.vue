<!--
  Bloc pour gerer ke groupement des article dans une categories.

-->
<template>
  <div>
    <!-- Menu -->
    <div class="d-flex text-center text-white mb-4">
      <div
        class="w-50 p-3 border click-pointer"
        :class="{
          'bg-secondary': current_tab != 'manage_block',
          'bg-primary': current_tab == 'manage_block'
        }"
        @click="select_curent_tabs('manage_block')"
      >
        Liste des catégories
        <i class="fas fa-sync fa-spin " v-if="loading_blocs"></i>
      </div>
      <div
        class="w-50 p-3 border click-pointer"
        :class="{
          'bg-secondary': current_tab != 'associate',
          'bg-primary': current_tab == 'associate'
        }"
        @click="select_curent_tabs('associate')"
      >
        Associer les articles
        <i class="fas fa-sync fa-spin " v-if="loading_association"></i>
      </div>
    </div>
    <!-- alert -->
    <alert
      :_formated_alert_trigger_show="formated_alert_trigger_show"
      :show_alert="show_alert"
      :alert_attribut_class="class_alert"
      :alert_message="alert_message"
      @ev_alert_close="alert_close_static"
    ></alert>
    <!-- Contenus -->
    <div class="" v-show="current_tab == 'manage_block'">
      <div class="" v-show="display_bloc == 'liste_bloc'">
        <tableau-gestion
          :show_id="true"
          :show_action="true"
          :class_table="'array-liste-datas categories'"
          :rows="customdatas1"
          :headers="table_headers"
          :empty_message="table_empty_message"
          :table_title="table_title"
          :show_title="table_show_title"
          :template_footer="table_template_footer"
          :datas_footer="table_datas_footer"
          :is_running="table_select_blog_is_running"
          :template_tableau_action="table_template_tableau_action"
          :template_edit="table_template_edit"
          :datas_ligne_edit="table_datas_ligne_edit"
          :template_edit_is_runing="table_template_edit_is_runing"
          :template_tableau_index="template_tableau_index"
          @ev_action_ev_template_tableau_action="
            ev_action_ev_template_tableau_action
          "
          @ev_template_edit="ev_template_edit"
          ref="tableau_gestion"
        ></tableau-gestion>

        <gestion-blocs-edit
          :is_runing="template_ordering_is_runing"
          @ev_custom_submit="ev_custom_submit_parent"
          :configs="{ display_add_button: true }"
        ></gestion-blocs-edit>
      </div>
      <div v-show="display_bloc == 'form-edit'">
        <h4>Editer la categorie</h4>
        <!--
          le running utilise un mecanisme compliqué pour la maintenance.(this.customdatas3)
        -->
        <!-- Formulaire d'edition. -->
        <builder-forms
          ref="builderformsedit"
          :forms="formated_forms_edit"
          :show_submit="false"
          :form_contain_class="'w-100 '"
          :form_class="'row-0'"
          :template_submit="template_submit"
          :custom_template_edit_is_runing="template_edit_is_runing"
          @ev_builder_forms="ev_builder_forms"
        ></builder-forms>
      </div>
      <div v-show="display_bloc == 'form-add'">
        <!-- Formulaire d'ajout -->
        <builder-forms
          ref="builderformsadd"
          :forms="formated_forms_add"
          :show_submit="false"
          :form_contain_class="'w-100 '"
          :form_class="'row-0'"
          :template_submit="template_submit"
          :custom_template_edit_is_runing="template_edit_is_runing"
          @ev_builder_forms="ev_builder_forms_add"
        ></builder-forms>
      </div>
    </div>
    <div class="" v-show="current_tab == 'associate'">
      <!-- Template pour les bouttons groupés (menu) -->
      <menus-buttons
        :group_buttons="customdatas1"
        ref="menu_buttons"
        @ev_menu_button="ev_menu_button_associate"
      ></menus-buttons>
      <!-- Formulaire d'ajout -->
      <builder-forms
        ref="builderformsselect"
        :forms="formated_forms_select"
        :show_submit="false"
        :form_contain_class="'w-100 '"
        :form_class="'row-0'"
        @ev_builder_forms="ev_builder_forms_select"
      ></builder-forms>

      <tableau-gestion
        :show_id="true"
        :show_action="true"
        :class_table="'mt-3 array-liste-datas articles'"
        :rows="articles_attach"
        :headers="table_headers2"
        :template_tableau_action="table_template_tableau_action2"
        :template_tableau_index="template_tableau_index"
        @ev_action_ev_template_tableau_action="
          ev_action_ev_template_tableau_action2
        "
        ref="tableau_gestion2"
      ></tableau-gestion>
      <gestion-blocs-edit
        :is_runing="template_ordering_is_runing"
        @ev_custom_submit="ev_custom_submit_parent"
        :configs="{ display_add_button: false }"
      ></gestion-blocs-edit>
    </div>
  </div>
</template>

<script>
/**
 * Contient les bouttons pour les actions au niveau de la cellule action
 */
import TemplateTableauAction from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Tableau/Elements/TemplateTableauActionExterne.vue";
/**
 * Template pour gerer les buttons dans le formulaires.
 */
import GestionBlocsEdit from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocsEdit.vue";

/**
 *
 */
import GestionBlocsDelete from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocsDelete.vue";

/**
 *
 */
import MenusButtons from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Menus/MenusButtons.vue";
/**
 * Template pour gerer les données vides.
 * ( il faut externaliser ce template ou trouver une autre apporche )
 */
const table_empty_categorie = {
  name: "TableEmptyCategorie",
  props: {
    datas: {
      type: [String, Boolean, Object, Array],
      default: "Vide"
    }
  },
  template: `<div v-html="datas" class="text-center"></div>`
};
/**
 * Template index
 */
const templateTableauIndex = {
  neme: "templateTableauIndex",
  props: {
    datas_index: {
      type: [Number, String, Object]
    }
  },
  template: `
   <div class="text-center">
     <div>
      {{datas_index}}
     </div>
     <span class="identifiant"><i class="fas fa-arrows-alt fa-2x text-warning"></i></span>
   </div>
   `
};
export default {
  name: "GestionBlocs",
  props: {
    customdatas1: Array, // données du tableaux (row)
    customdatas3: Boolean,
    modal_body: [Array, Object]
  },
  data() {
    return {
      loading_blocs: false,
      /**
       * alert
       */
      show_alert: false,
      class_alert: "alert-danger",
      alert_message: "",
      id_admin_local: false,
      alert_trigger_show: 0,
      /**
       *
       */
      current_tab: "manage_block",
      loading_association: false,
      display_bloc: "liste_bloc",
      row: {},
      /**
       * Table
       */
      table_empty_message: "Aucune categorie",
      table_show_title: false,
      table_title: "",
      table_select_blog_is_running: false,
      // Contient les buttons d'action dans la cellule action.
      table_template_tableau_action: TemplateTableauAction,
      table_template_tableau_action2: {
        ...TemplateTableauAction,
        mounted() {
          this.edit_button = false;
        }
      },
      table_datas_ligne_edit: {},
      // Contient le formulaire d'edition des données ou de toute autre actions.
      table_template_edit: "",
      table_template_edit_is_runing: false,
      template_tableau_index: "",
      table_headers2: {
        id: {
          name: "id",
          label: "Id",
          addclass_tr: {
            custom: "drap-drop-box"
          },
          addclass_td: {
            custom: "d-none"
          }
        },
        title: {
          name: "title",
          label: "Titre"
        }
      },
      /**
       * Forms
       */
      template_submit: GestionBlocsEdit,
      formated_forms_add: [
        {
          template: "input-text",
          input: {
            value: ""
          },
          label: "Nom de la categorie",
          name: "categorie",
          put_empty: true,
          rules: "required"
        }
      ],
      template_ordering_is_runing: false,
      /*
      template_submit: {
        ...GestionBlocsEdit,
        created: function() {
          console.log("GestionBlocsEdit \n", GestionBlocsEdit);
          alert("");

          this.configs.display_add_button = false;
          this.configs.is_runing = true;

          console.log(this);
        }
      },
      /**
       * Reference de l'intance pour les boutons de submissions (edit)
       */
      Vue_templatesubmitEdit: {},
      /**
       * Reference de l'intance pour les boutons de submissions (add)
       */
      Vue_templatesubmitAdd: {},
      Vue_tableau_gestion: {},
      Vue_menu_buttons: {},
      //formated_forms_select: [],
      /**
       * Contient tous les articles( flux from shopify )
       */
      flux_articles: [],
      /**
       * contient tous les articles de la  categories selectionners;
       */
      articles_attach: [],
      /**
       * Contient les articles disponibles dans la liste.
       */
      articles_select: [],
      /**
       * Identification de la categorie selectionnée.
       */
      // index du tableau
      current_categorie_index: null,
      current_categorie_id: null,
      current_categorie_articles: null
    };
  },
  mounted() {
    //console.log("GestionBlocs modal_body : \n", this.modal_body);
    //var self = this;
    this.template_tableau_index = templateTableauIndex;
    /**
     * Permet de definir ou appliques les options du formualaire d'edition.
     */
    this.Vue_templatesubmitEdit = this.$refs.builderformsedit.$refs.templatesubmit;

    this.Vue_templatesubmitAdd = this.$refs.builderformsadd.$refs.templatesubmit;

    this.Vue_tableau_gestion = this.$refs.tableau_gestion;
    this.Vue_menu_buttons = this.$refs.menu_buttons;
    //console.log("Vue_tableau_gestion2 : ", this.$refs.tableau_gestion2);
    //this.formated_forms_select = [];
  },
  components: {
    "gestion-blocs-edit": GestionBlocsEdit,
    "menus-buttons": MenusButtons
  },
  computed: {
    table_headers: {
      get() {
        if (this.modal_body && this.modal_body.table_headers) {
          return this.modal_body.table_headers;
        }
        return {};
      }
    },
    template_edit_is_runing: {
      get() {
        return this.customdatas3;
      }
    },
    table_template_footer: {
      get() {
        if (
          !this.customdatas1.length &&
          this.table_headers &&
          Object.keys(this.table_headers).length
        ) {
          return table_empty_categorie;
        } else {
          return "";
        }
      }
    },
    table_datas_footer: {
      get() {
        if (
          !this.customdatas1.length &&
          this.table_headers &&
          Object.keys(this.table_headers).length
        ) {
          return " Aucune categorie disponible ";
        } else {
          return "";
        }
      }
    },
    formated_forms_edit: {
      get() {
        var results = [];
        results.push({
          template: "input-text",
          input: {
            value: this.row.index
          },
          name: "index",
          classe: "d-none"
        });
        if (this.row.ligne) {
          for (const i in this.row.ligne) {
            //console.log("\n ligne : ", i, this.row.ligne[i]);
            //console.log("\n entete : ", this.table_headers[i]);
            if (this.table_headers[i].edit) {
              results.push({
                template: this.table_headers[i].edit.template,
                input: {
                  value: this.row.ligne[i] ? this.row.ligne[i] : ""
                },
                name: this.table_headers[i].edit.name
                  ? this.table_headers[i].edit.name
                  : i,
                classe: this.table_headers[i].edit.classe
                  ? this.table_headers[i].edit.classe + " " + i
                  : i,
                options: this.table_headers[i].edit.options
              });
            }
          }
          //this.setTemplate(true);
          return results;
        }
        //this.setTemplate(false);
        return [];
      }
    },
    formated_alert_trigger_show: {
      get() {
        if (
          this.modal_body &&
          this.modal_body.alert &&
          this.modal_body.alert.alert_trigger_show
        ) {
          if (
            this.modal_body.alert.alert_trigger_show > this.alert_trigger_show
          ) {
            if (this.modal_body.alert.type === "warning") {
              this.ev_show_alert_warning(this.modal_body.alert.msg);
            }
            this.set_alert_trigger_show(
              this.modal_body.alert.alert_trigger_show
            );
            return this.modal_body.alert.alert_trigger_show;
          }
        }
        return 0;
      }
    },
    /*
    group_buttons: {
      get() {
        return this.customdatas1; // lists categories.
      }
    },
    /**/
    formated_forms_select: {
      get() {
        //console.log("formated_forms_select");
        return [
          {
            template: "input-select",
            input: {
              value: ""
            },
            label: "Selectionner les articles",
            name: "article",
            options: this.articles_select,
            trigger: {
              submit: true
            }
          }
        ];
      }
    }
  },
  methods: {
    displayListsDatas() {
      this.display_bloc = "liste_bloc";
      this.current_tab = "manage_block";
    },
    /**
     * Select_curent_tabs
     */
    select_curent_tabs: function(current_tab) {
      this.current_tab = current_tab;
      if (current_tab == "manage_block") {
        this.display_bloc = "liste_bloc";
      }
    },
    ev_action_ev_template_tableau_action(datas) {
      var self = this;
      this.table_datas_ligne_edit = datas;
      if (datas.action == "edit") {
        /**
         * Masque le bouton ajouter lors de la modification
         */
        this.Vue_templatesubmitEdit.set_add_button(false);
        /**
         * On selectionne le bloc d'edition.
         */
        this.display_bloc = "form-edit";
        this.row = datas;
        this.table_template_edit = "";
      } else if (datas.action == "delete") {
        /**
         * On charge le template adequat.
         */
        this.table_template_edit = GestionBlocsDelete;
        /**
         *  On affiche le modal confirm
         */
        /**
         * Le composant ne charge pas par defaut, il faut un certains temps pour
         * ce dernier soit actif
         */

        var execution = function() {
          if (self.Vue_tableau_gestion.$refs.cps_template_edit) {
            self.Vue_tableau_gestion.$refs.cps_template_edit.open_modal();
          } else {
            setTimeout(function() {
              console.log("waitting compenent load");
              execution();
            }, 100);
          }
        };
        execution();
      }
    },
    ev_action_ev_template_tableau_action2(datas) {
      console.log("ev_action_ev_template_tableau_action2", datas);
      this.$emit("ev_modal_simple", {
        remove_articles_in_categorie: datas,
        current_categorie_index: this.current_categorie_index,
        current_categorie_id: this.current_categorie_id
      });
    },
    ev_template_edit(datas) {
      if (datas.action === "confirm_delete") {
        this.$emit("ev_modal_simple", datas);
      }
    },
    ev_custom_submit_parent(datas) {
      if (datas.action == "add_datas") {
        this.display_bloc = "form-add";
        this.Vue_templatesubmitAdd.set_add_button(false);
      } else {
        this.$emit("ev_modal_simple", {
          datas: datas,
          action: "savemetafieldBlogCategory"
        });
      }
    },

    ev_builder_forms(datas) {
      this.$emit("ev_modal_simple", { form: datas });
    },
    ev_builder_forms_add(datas) {
      if (datas.forms && datas.forms.categorie !== "") {
        this.$emit("ev_modal_simple", { form_add: datas });
      } else {
        var msg = "Le champs est requis";
        this.ev_show_alert_warning(msg);
      }
    },
    ev_builder_forms_select(datas) {
      console.log("ev_builder_forms_select", datas);
      this.$emit("ev_modal_simple", {
        add_articles_in_categorie: datas,
        current_categorie_index: this.current_categorie_index,
        current_categorie_id: this.current_categorie_id
      });
    },
    ev_show_alert(datas) {
      this.show_alert = true;
      this.class_alert = datas.classe;
      this.alert_message = datas.title;
    },
    ev_close_alert() {
      this.show_alert = false;
      this.class_alert = "";
      this.alert_message = "";
    },
    alert_close_static() {
      this.ev_close_alert();
    },
    ev_show_alert_warning(msg) {
      var data = {
        classe: "alert-warning",
        title: msg
      };
      this.ev_show_alert(data);
    },
    show_alert__ajax_messages(vals) {
      var data = {
        classe: "alert-" + vals.type,
        title: vals.msg
      };
      this.ev_show_alert(data);
    },
    set_alert_trigger_show(value) {
      this.alert_trigger_show = value;
    },
    close_modal_confirm() {
      this.$set(this.table_datas_ligne_edit, "action", "close");
    },
    active__table_template_edit_is_runing(value) {
      this.table_template_edit_is_runing = value;
    },
    set_loading_blocs(value = false) {
      this.loading_blocs = value;
    },
    ev_menu_button_associate(datas) {
      //console.log("ev_menu_button_associate : ", datas);
      this.current_categorie_index = datas.index;
      this.current_categorie_id = datas.id;
      this.current_categorie_articles = datas.articles;
      this.get_list_articles_disponible();
      this.getListArticlesSelectionner();
      /**
       * à supprimer sur le parent
       * On renvoit les données vers le parent pour recuperer les articles selectionnées.
       */
      //this.$emit("ev_modal_simple", { articles_attach: datas });
    },
    getListArticlesSelectionner() {
      var self = this;
      self.articles_attach = [];
      var articlesSelectionner = this.current_categorie_articles;
      /*
      console.log(
        "getListArticlesSelectionner ",
        "\n arts : ",
        articlesSelectionner
      );
      */
      for (const i in articlesSelectionner) {
        for (const j in this.flux_articles) {
          if (this.flux_articles[j].id === articlesSelectionner[i]) {
            self.articles_attach.push({
              id: this.flux_articles[j].id,
              title: this.flux_articles[j].title
            });
          }
        }
      }
      /**/
    },
    getListArticlesUsed() {
      return new Promise(resolve => {
        var rows = this.customdatas1;
        var articleUsed = [];

        if (rows.length) {
          for (const i in rows) {
            if (rows[i].articles && rows[i].articles.length) {
              for (const j in rows[i].articles) {
                articleUsed.push(rows[i].articles[j]);
              }
            }
            var ii = i + 1;
            if (rows.length <= ii) {
              resolve({ status: true, articles: articleUsed });
            }
          }
        } else {
          resolve({ status: false, articles: articleUsed });
        }
      });
    },
    list_articles_disponible(rows, article_used) {
      return new Promise(resolve => {
        //console.log("article_used.articles ", article_used.articles);
        var options = {};
        if (rows.length) {
          for (const i in rows) {
            if (!article_used.articles.includes(rows[i].id)) {
              options[rows[i].id] = rows[i].title;
            }
            var ii = i + 1;
            if (rows.length <= ii) {
              resolve({ status: true, options: options });
            }
          }
        } else {
          resolve({ status: false, options: options });
        }
      });
    },
    get_list_articles_disponible() {
      console.log("get_list_articles_disponible");
      var flux_articles = this.flux_articles;
      var self = this;
      (async function() {
        var article_used = await self.getListArticlesUsed();
        var options = await self.list_articles_disponible(
          flux_articles,
          article_used
        );
        //console.log("options : ", options, "\n article_used", article_used);
        self.articles_select = options.options;
        /**
         * à cette etape on ajoute le trie
         */
        self.$emit("ev_modal_simple", {
          sortable: "article",
          current_categorie_index: self.current_categorie_index,
          current_categorie_id: self.current_categorie_id
        });
      })();
    },
    set_flux_articles(flux_articles) {
      this.flux_articles = flux_articles;
      //console.log("this.Vue_menu_buttons : ", this.Vue_menu_buttons);
      /**
       * On a un soucis de reactivité de données.
       * on met à jour cette variable
       */
      this.Vue_menu_buttons.stop_after = true;
    }
  }
};
</script>

<style lang="scss">
.array-liste-datas {
  tr td {
    vertical-align: middle;
    width: 60%;
  }
  tr td:first-child {
    width: 15%;
  }
  tr td:last-child {
    width: 25%;
  }
  thead tr th:first-child,
  tbody tr td:first-child {
    text-align: center;
  }
  thead tr th:last-child {
    text-align: right;
  }
}
.setting-action {
  display: flex;
  justify-content: flex-end;
}
.ui-sortable-helper {
  display: table;
}
</style>

<!--
      /siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocs.vue
-->
