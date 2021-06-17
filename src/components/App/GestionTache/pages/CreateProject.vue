<template>
  <div class="col-sm-6 mx-auto">
    <h2>Creer un projet</h2>
    <!-- Formulaire d'edition. -->
    <builder-forms
      ref="builderformsedit"
      :forms="formated_forms_edit"
      :show_submit="true"
      :form_contain_class="'w-100 '"
      :form_class="'row-0'"
      :custom_template_edit_is_runing="template_edit_is_runing"
      @ev_builder_forms="ev_builder_forms"
    ></builder-forms>
  </div>
</template>

<script>
export default {
  name: "CreateProjec",
  data() {
    return {
      formated_forms_edit: [],
      template_edit_is_runing: false
    };
  },
  mounted() {
    this.buildform();
  },
  methods: {
    buildform() {
      this.formated_forms_edit = [
        {
          template: "input-text",
          input: {
            value: ""
          },
          label: "Nom du project",
          name: "titre",
          rules: "required"
        },
        {
          template: "input-text",
          input: {
            value: ""
          },
          label: "Description du project",
          name: "text",
          rules: "required"
        }
      ];
    },
    ev_builder_forms(datas) {
      console.log(datas);
      this.$emit("ev_index", { "add-project-form": datas });
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/CreateProjec.vue
-->
