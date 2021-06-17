<!--
    On a deux approche, suivant que l'on charge via le template ou via un object.
    - via un object : on otilise les functions ( de methods ) pour gerer l'etat.
    - via le template on utilise le props.
-->
<template>
  <div class="_action">
    <div>
      <hr />
      <span class="btn btn-outline-success btn-sm" @click="save_data">
        Enregistrer <i class="fas fa-sync fa-spin" v-if="display_is_runing"></i>
      </span>
      <span
        v-if="configs.display_add_button"
        class="btn btn-outline-success btn-sm float-right"
        @click="add_datas"
      >
        Ajouter un bloc
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GestionBlocsEdit",
  props: {
    datas: {
      type: [String, Boolean, Object, Array]
    },
    is_runing: {
      type: Boolean
    },
    configs: {
      type: Object,
      default: function() {
        return {
          display_add_button: true
        };
      }
    }
  },
  computed: {
    display_is_runing: {
      get() {
        if (!(this.configs.is_runing === undefined)) {
          return this.configs.is_runing;
        } else {
          return this.is_runing;
        }
      }
    }
  },
  methods: {
    save_data() {
      this.$emit("ev_custom_submit", { action: "save", submit: true });
    },
    add_datas() {
      this.$emit("ev_custom_submit", { action: "add_datas" });
    },
    set_running(value = true) {
      this.$set(this.configs, "is_runing", value);
    },
    set_add_button(value = true) {
      this.$set(this.configs, "display_add_button", value);
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocsEdit.vue
-->
