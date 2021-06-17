<template>
  <div>
    <card-slot class="mb-2">
      <template v-slot:card_header>
        <div class="d-flex justify-content-between0">
          <div
            v-html="project.titre"
            @click="select_project(project.idcontents)"
          ></div>
          <div>
            <div class="dropdown">
              <button
                class="btn btn-sm btn-secondary dropdown-toggle"
                type="button"
                :id="'dropdownMenuButton' + project.idcontents"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-cog"></i>
              </button>
              <div
                class="dropdown-menu"
                :aria-labelledby="'dropdownMenuButton' + project.idcontents"
              >
                <a class="dropdown-item" href="#" @click="add_tache(project)">
                  Ajouter un tache
                </a>
                <a class="dropdown-item" href="#"> Modifier le style </a>
                <a class="dropdown-item" href="#"> Minimaliser </a>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:card_body>
        <div v-html="project.text"></div>
      </template>
      <slot> </slot>
    </card-slot>
  </div>
</template>

<script>
import CardSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Cards/card-slot.vue";
export default {
  name: "Cards",
  props: {
    project: {
      type: [Array, Object],
      default: function() {
        return [];
      }
    }
  },
  components: {
    "card-slot": CardSlot
  },
  methods: {
    select_project(idcontents) {
      this.$emit("ev_select_project", idcontents);
    },
    add_tache(project) {
      this.$emit("ev_add_tache", {
        project: project
      });
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/Cards.vue
-->
