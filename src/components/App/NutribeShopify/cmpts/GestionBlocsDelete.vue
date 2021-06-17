<template>
  <div>
    <modal-simple
      :id_modal="formated_id_modal"
      :type_modal_bootstrap="false"
      :open_modal_custom="open_modal_custom"
      :titre_modal_preview="titre_modal_preview"
      :template_modal_body="template_modal_body"
      :template_modal_footer="template_modal_footer"
      :datas_modal_footer="datas_modal_footer"
      :is_runing="template_edit_is_runing"
      @ev_modal_simple_footer="ev_modal_simple_footer"
      @ev_modal_simple="ev_modal_simple"
    ></modal-simple>
  </div>
</template>

<script>
import ModalSimple from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSimple.vue";
const template_modal_body = {
  name: "templateModalBody",
  template: `<div>
  <strong class="d-block mb-4"> Etes vous certains de vouloir supprimer, cette action est irreverssible. </strong>
  </div>`
};
const template_modal_footer = {
  name: "templateModalFooter",
  props: {
    modal_footer: {
      type: [Object]
    },
    is_runing: {
      type: Boolean
    }
  },
  template: `<div>
  <div class="d-flex justify-content-end"><span class="btn btn-sm btn-outline-warning click-pointer mr-4" @click="close_modal"><i class="fas fa-undo-alt mr-2"></i> Annulée</span> <span class="btn btn-sm btn-outline-danger click-pointer" @click="confirm_delete"><i class="far fa-trash-alt mr-2"></i> Supprimer <i class="fas fa-sync fa-spin ml-2" v-if="is_runing"></i></span></div>
  </div>`,
  methods: {
    close_modal() {
      this.$emit("ev_modal_simple_footer", { status: true, action: "close" });
    },
    confirm_delete() {
      this.$emit("ev_modal_simple_footer", {
        status: true,
        action: "confirm_delete",
        row: this.modal_footer
      });
    }
  }
};
export default {
  name: "GestionBlocsDelete",
  props: {
    row: {
      type: [String, Boolean, Object, Array]
    },
    template_edit_is_runing: {
      type: Boolean
    }
  },
  data() {
    return {
      template_modal_body: "",
      template_modal_footer: "",
      open_modal_custom: false,
      datas_modal_footer: {}
    };
  },
  mounted() {
    this.template_modal_body = template_modal_body;
    this.template_modal_footer = template_modal_footer;
  },
  components: {
    "modal-simple": ModalSimple
  },
  computed: {
    formated_id_modal: {
      get() {
        return "modal-del-" + this.row.index;
      }
    },
    /*
    formated_open_modal_custom: {
      get() {
        if (this.row.action === "delete") {
          this.open_modal();
          return true;
        } else if (this.row.action === "close") {
          this.close_modal();
        }
        return false;
      }
    },
    /**/
    titre_modal_preview: {
      get() {
        if (this.row.ligne && this.row.ligne.value) {
          this.setDatafooter();
          return "Supprression de <b>" + this.row.ligne.value + "<b>";
        }
        return "...";
      }
    }
  },
  methods: {
    confirm_delete() {
      this.$emit("ev_custom_submit", { action: "save", submit: true });
    },
    add_datas() {
      this.$emit("ev_custom_submit", { action: "add_datas" });
    },
    open_modal() {
      this.open_modal_custom = true;
    },
    close_modal() {
      this.open_modal_custom = false;
    },
    ev_modal_simple_footer(datas) {
      if (datas.action == "close") {
        this.close_modal();
      }
      this.$emit("ev_template_edit", datas);
    },
    ev_modal_simple(datas) {
      console.log("ev_modal_simple : ", datas);
      if (datas.action == "close") {
        this.close_modal();
      }
    },
    setDatafooter() {
      this.datas_modal_footer = this.row;
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/GestionBlocsDelete.vue
-->
