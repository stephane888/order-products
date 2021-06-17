<template>
  <div>
    <modal-slot
      :id_modal="id_modal"
      :show_footer="true"
      :datas_modal_body="datas_modal_body"
    >
      <template v-slot:modal_header>
        <span v-html="modal_title"></span>
      </template>
      <slot>
        <strong class="d-block mb-4">
          Etes vous certains de vouloir supprimer, cette action est
          irreverssible.
        </strong>
      </slot>
      <template v-slot:modal_footer>
        <div class="d-flex justify-content-end">
          <span
            class="btn btn-sm btn-outline-warning click-pointer mr-4"
            @click="cancel"
          >
            <i class="fas fa-undo-alt mr-2"></i> Annulée
          </span>
          <span
            class="btn btn-sm btn-outline-danger click-pointer"
            @click="confirm_delete"
          >
            <i class="far fa-trash-alt mr-2"></i> Supprimer
          </span>
        </div>
      </template>
    </modal-slot>
  </div>
</template>

<script>
import ModalSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSlot.vue";
export default {
  name: "ModalConfirmDelete",
  props: {
    modal_title: {
      type: String
    },
    datas_modal_body: [Object, Array, String, Number],
    id_modal: [String, Number]
  },
  components: {
    "modal-slot": ModalSlot
  },
  methods: {
    confirm_delete() {
      this.$emit("ev_confirm_delete", {
        datas: this.datas_modal_body,
        action: "confirm_delete"
      });
    },
    cancel() {
      this.$emit("ev_cancel", {
        datas: this.datas_modal_body,
        action: "cancel"
      });
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalConfirmDelete.vue
-->
