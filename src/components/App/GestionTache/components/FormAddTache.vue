<template>
  <div>
    <slot name="header"> </slot>
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
