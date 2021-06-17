<template>
  <div>
    <span class="button-action btn-custom" @click="edit_ligne('edit')"
      >Préparer</span
    >
  </div>
</template>

<script>
export default {
  name: "ActionOrderProduct",
  props: {
    ligne: {
      type: [String, Boolean, Object, Array],
    },
    /**
     * Identifiant de la ligne(du tableau).
     */
    index: {
      type: [String, Number],
    },
  },
  methods: {
    edit_ligne(action) {
      this.send_action(action);
    },
    send_action(action) {
      this.$emit("ev_template_tableau_action", {
        ligne: this.ligne,
        index: this.index,
        action: action,
      });
    },
  },
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/cmpts/ActionOrderProduct.vue
-->
