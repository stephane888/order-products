<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      :messages="ajax_messages"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <!-- Tables construit avec datatables -->
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
        :blog="blog_select"
        :blogs="blogs"
        :metafields="metafields"
        :form_running="form_running"
        :parent_init="true"
        @ev_index="ev_index"
        ref="composant"
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
import load_configs from "./configs.js";
import Ajax from "./Ajax.vue";
import ModalSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSlot.vue";
import GestionCats from "./cmpts/GestionCats.vue";
//import PageBlogNone from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/PageBlogNone.vue";

export default {
  name: "PageBlog",
  data() {
    return {
      /**
       * Ajax.
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_messages: {
        msg: "",
        type: ""
      },
      /**
       * Tables.
       */
      table_id: "table-datas-blogs",
      metafields: [],
      blogs: [],
      blogs_select: [],
      datatable: {},
      /**
       *modal
       */
      id_modal: "action-blog",
      modal_title: "",
      modal_action: "",
      template_modalbody: "",
      /**
       *
       */
      modal_loading: false,
      form_running: false,
      blog_select: {},
      id_blog: "",
      VueGestionBlocs: {}
    };
  },
  components: {
    ajax: Ajax,
    "modal-slot": ModalSlot
  },
  mounted() {
    this.databaseConfig = load_configs.databaseConfig;
    //this.VueGestionBlocs = this.$refs.catmanage;
    //console.log("this.VueGestionBlocs : ", this.VueGestionBlocs);
    //this.VueGestionBlocs.show_button = false;
    this.getBlocs();
  },
  methods: {
    getBlocs() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_load_blogs";
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      switch (datas.token) {
        case "shopify_load_blogs":
          this.blogs = datas.return.shopify_load_blog.blogs;
          this.buildTable();
          break;
      }
    },
    ev_ajax_error() {},
    buildTable() {
      var self = this;
      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }
      this.datatable = $("#" + this.table_id).DataTable({
        data: this.blogs,
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
                  <option value="gestion_cat_virtuelv2">Gestions des categories</option>
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
            self.blog_select = table.row(tr).data();
            //console.log("self.blog_select : ", self.blog_select);
            self.open_modal(self.blog_select, action);
          }
        }
      );
    },
    open_modal(data, action) {
      var self = this;
      self.modal_title = data.title;
      self.modal_action = action;
      switch (this.modal_action) {
        case "gestion_cat_virtuel":
          // on charge son module.
          //self.id_blog = self.blog_select.id;
          //self.VueGestionBlocs.template_modal_body = "";
          //$('button[data-action="gestion-blocs"]').trigger("click");
          break;
        default:
          self.select_template();
          $("#" + self.formated_id_modal).modal("show");
          $("#" + self.formated_id_modal).on("shown.bs.modal", function() {
            $("#" + self.formated_id_modal).off("shown.bs.modal");
          });
          break;
      }
    },
    close_modal() {
      var self = this;
      $("#" + self.formated_id_modal).modal("hide");
    },
    ev_index(datas) {
      switch (datas.action) {
        case "save_metafield":
          this.form_running = true;
          this.saveMetaField(
            datas.type,
            datas.key,
            datas.type_metafield,
            datas.id_entity,
            datas.value,
            datas.id_parent
          );
          break;
        case "update_select_blog":
          this.blogs_select = datas.blogs_select;
          break;
      }
    },
    select_template() {
      switch (this.modal_action) {
        case "gestion_cat_virtuelv2":
          this.template_modalbody = GestionCats;
          break;
        default:
          this.template_modalbody = "";
          break;
      }
      this.applyConfigsComponent();
    },
    applyConfigsComponent() {
      var self = this;
      setTimeout(function() {
        self.composant = self.$refs.composant;
        switch (self.modal_action) {
          case "gestion_cat_virtuelv2":
            self.composant.set_blog_id(self.blog_select.id);
            break;
        }
      }, 150);
    }
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-style-" + this.id_modal;
      }
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/PageBlog.vue
-->
