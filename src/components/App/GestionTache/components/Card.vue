<template>
  <div :class="class_card">
    <card-slot
      class="mb-2"
      :class_card_body="class_card_body"
      :class_card="container_class_card"
      :id_html="'accordion-' + project.idcontents"
      :parent_manage_accordion="true"
      ref="cardaccordion"
    >
      <template v-slot:card_header>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <a
              href="#"
              @click.prevent="select_project(project)"
              v-html="project.titre"
            >
            </a>
          </div>
          <div>
            <div class="px-3 d-flex">
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="toggle_accordion(project)"
              >
                <i class="fas fa-angle-up" v-if="!card_open"></i>
                <i class="fas fa-angle-down" v-if="card_open"></i>
              </a>
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="select_project(project)"
              >
                <i class="fas fa-eye"></i>
              </a>
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="add_tache(project)"
              >
                <i class="fas fa-plus"></i>
              </a>
              <a class="btn btn-sm " href="#" @click.prevent="edit(project)">
                <i class="far fa-edit"></i>
              </a>
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="edit_style(project)"
              >
                <i class="fas fa-desktop"> </i>
              </a>
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="edit_ressources(project)"
              >
                <i class="fas fa-database"></i>
              </a>
              <a
                class="btn btn-sm "
                href="#"
                @click.prevent="edit_timer(project)"
              >
                <i class="fas fa-database"></i>
              </a>
              <a
                class="btn btn-sm text-danger"
                href="#"
                @click.prevent="delete_project(project)"
              >
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:card_body>
        <div v-html="project.text" class="col-sm-12"></div>
      </template>
      <slot> </slot>
    </card-slot>
  </div>
</template>

<script>
import CardSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Cards/card-slot-accordion.vue";
export default {
  name: "Cards",
  props: {
    project: {
      type: [Array, Object],
      default: function() {
        return [];
      }
    },
    class_card_body: {
      type: String
    },
    class_card: {
      type: String
    },
    container_class_card: {
      type: String
    }
  },
  components: {
    "card-slot": CardSlot
  },
  data() {
    return {
      VueCardAccordion: {},
      card_open: false
    };
  },
  mounted() {
    this.VueCardAccordion = this.$refs.cardaccordion;
    this.chek_status_accordion();
  },
  methods: {
    select_project(idcontents) {
      this.$emit("ev_select_project", idcontents);
    },
    add_tache(project) {
      this.$emit("ev_add_tache", {
        project: project
      });
    },
    edit(project) {
      this.$emit("ev_edit", {
        project: project
      });
    },
    delete_project(project) {
      this.$emit("ev_delete_project", {
        project: project
      });
    },
    edit_style(project) {
      this.$emit("ev_edit_style", {
        project: project
      });
    },
    edit_ressources(project) {
      this.$emit("ev_edit_ressources", {
        project: project
      });
    },
    edit_timer(project) {
      this.$emit("ev_edit_timer", {
        project: project
      });
    },
    toggle_accordion(project) {
      this.VueCardAccordion.toggle_accordion();
      this.card_open = this.VueCardAccordion.card_open;
      console.log("project : ", project);
    },
    /**
     * Verifie l'etat de l'accordion et
     */
    chek_status_accordion() {
      var configs = {};
      if (this.project.testconfigs) {
        configs = JSON.parse(this.project.testconfigs);
        if (
          configs.class_card_body !== "" &&
          !configs.class_card_body.includes("collapse")
        ) {
          this.VueCardAccordion.toggle_accordion();
        }
      }
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/Cards.vue
-->
