<template lang="html">
  <div>
    <table :id="table_id"></table>
    <modal-slot
      :id_modal="formated_id_modal"
      :show_footer="true"
      :modal_position="''"
    >
      <template v-slot:modal_header>
        <h5 v-html="modal_title" class="modal-title"></h5>
      </template>
      <div class="d-flex justify-content-center p-5" v-if="modal_loading">
        <h2><i class="fas fa-sync fa-spin text-warning"> </i></h2>
      </div>
      <component
        v-show="!modal_loading"
        v-bind:is="template_modalbody"
        :entity="product"
        type-entity="product"
      ></component>
    </modal-slot>
  </div>
</template>

<script>
/**
 * Jquery doit etre definie (simulation);
 */
if (window.jQuery) {
  var $ = window.jQuery;
}
/**
 * moment simulation
 */
if (window.moment) {
  var moment = window.moment;
}
import configs from "./configs.js";

export default {
  name: "PageProduit",
  props: {
    //
  },
  components: {
    "modal-slot": () => import("../../Modals/ModalSlot.vue")
  },
  data() {
    return {
      products: [],
      product: {},
      datatable: {},
      /**
       * Modal
       */
      id_modal: "action-blog",
      modal_title: "",
      modal_action: "",
      template_modalbody: "",
      modal_loading: false,
      /**
       * Tables.
       */
      table_id: "table-datas-products"
    };
  },
  mounted() {
    this.GetProducts();
  },
  watch: {
    //
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-style-" + this.id_modal;
      }
    },
    productId() {
      if (this.product.id) {
        return this.product.id;
      } else {
        return 0;
      }
    }
  },
  methods: {
    GetProducts() {
      configs.GetProducts().then(result => {
        this.products = result;
        this.buildTable();
      });
    },
    open_modal(action) {
      var self = this;
      self.modal_title = this.product.title;
      $("#" + self.formated_id_modal).modal("show");
      $("#" + self.formated_id_modal).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal).off("shown.bs.modal");
      });
      switch (action) {
        case "gestion_saveurs":
          this.template_modalbody = () => import("./cmpts/GestionSaveurs.vue");
          break;

        case "gestion_models_sections":
          this.template_modalbody = () =>
            import("./cmpts/GestionModelsSection.vue");
          break;
        case "show_metafields":
          this.template_modalbody = () =>
            import("./ComponentsShopify/Products/MetaFields");
          break;
        default:
          this.template_modalbody = "";
          break;
      }
    },
    buildTable() {
      var self = this;
      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }
      this.datatable = $("#" + this.table_id).DataTable({
        data: self.products,
        //info: false,
        order: [[0, "desc"]],
        columns: [
          { data: "id", title: "# ID " },
          { data: "title", title: "Titre" },
          {
            data: "created_at",
            title: "Date de creation",
            render: function(data) {
              return moment(data).format("DD/MM/YYYY à HH:mm");
              //return $.fn.dataTable.render.moment(data);
            },
            className: "created-at"
          },
          {
            className: "details-control",
            orderable: false,
            data: null,
            title: "Action",
            defaultContent: `<select class=" form-control select-action">
                  <option value="" selected> Aucun(e)</option>
                  <option value="gestion_saveurs"> Gerer des saveurs </option>
                  <option value="gestion_models_sections"> Gestion models sections </option>
                </select>`
          }
          /**
           * <option value="gestion_cat_virtuel"> Gestions des categories </option>
           * Permet de d'utiliser l'approche 1, qui bug un peu.
           * utilise le fichier PageBlogNone
           */
        ],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
      });
      var table = this.datatable;
      $("#" + this.table_id).addClass("light-table table");
      $("#" + this.table_id + " thead").addClass("thead-light table-header");
      /**
       * On ajoute les colonnes selectionnes en surbriallance
       */
      /*
      $("#" + this.table_id + " tbody").on("mouseenter", "td", function() {
        var colIdx = table.cell(this).index().column;

        $(table.cells().nodes()).removeClass("highlight");
        $(table.column(colIdx).nodes()).addClass("highlight");
      });
      /**/
      /**
       * On applique l'action
       */
      $("#" + this.table_id + " tbody").on(
        "click",
        "tr .select-action",
        function() {
          var action = $(this).val();
          var tr = $(this)
            .parent()
            .parent();
          if (action !== "") {
            self.product = table.row(tr).data();
            //console.log("self.product : ", self.product);
            self.open_modal(action);
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>

<!--
 //nom du fichier en pascal.
 //<template>
 - le nom des attributs en kebab-case;
 - la valeur des attributs et des variables en camelCase;
 - function en PascalCase
 //props, data
 - variable en camelCase
 //methods
 - variable en PascalCase
-->
