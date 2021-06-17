<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
      :messages="ajax_messages"
      :url="ajax_url"
      ref="ajax"
    ></ajax>

    <div class="card card-light" :basetype="database_config">
      <h5 class="card-header">
        <span class="d-block" v-html="nombre_commande_a_traiter_display"></span>
      </h5>
      <div class="card-body">
        <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
          <li class="nav-item" role="presentation" titlea="Par total">
            <a
              class="nav-link active"
              id="home-tab"
              data-toggle="tab"
              href="#home"
              role="tab"
              aria-controls="home"
              aria-selected="true"
              >Articles</a
            >
          </li>
          <li class="nav-item" role="presentation" title="Par unitées">
            <a
              class="nav-link"
              id="profile-tab"
              data-toggle="tab"
              href="#profile"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              >Produits</a
            >
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <tableau-gestion
              :rows="table_rows_v2"
              :headers="table_headers_v2"
              :class_table="class_table"
              :template_footer="template_table_footer"
              :show_action="table_show_action"
              :template_tableau_action="table_template_tableau_action"
              @ev_action_ev_template_tableau_action="
                ev_action_ev_template_tableau_action
              "
              :template_tableau_action_header="''"
            ></tableau-gestion>
          </div>
          <div
            class="tab-pane fade"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <tableau-gestion
              :rows="table_rows_v2"
              :headers="table_headers"
              :class_table="class_table2"
              :template_footer="template_table_footer"
              :template_tableau_action="table_template_tableau_action"
              :show_action="table_show_action"
              @ev_action_ev_template_tableau_action="
                ev_action_ev_template_tableau_action
              "
              :template_tableau_action_header="''"
            ></tableau-gestion>
          </div>
        </div>

        <!--
        <hr />
        <tableau_gestion
          :rows="table_rows"
          :headers="table_headers"
          :show_footer="false"
          :align_header="true"
          :show_reel_index="true"
          :show_id="false"
        ></tableau_gestion>
      --></div>
    </div>

    <modal-simple
      :actionparent="actionparent"
      :id_modal="formated_id_modal"
      :template_modal_body="template_modal_body"
      :datas_modal_body="modal_body"
      :titre_modal_preview="titre_modal"
      @ev_modal_simple="ev_modal_simple"
      ref="modal_simple"
    >
    </modal-simple>

    <send_data_ajax
      :url="url_post"
      :headers="headers"
      @ev_data_from_ajax="data_from_ajax"
      :datas="post_datas"
      :trigger_loanding="trigger_post_loanding"
    ></send_data_ajax>
    <!-- RApport -->
    <rapport
      :listes_vente_sku_amazon="listes_vente_sku_amazon"
      :listes_vente_sku_shopify="listes_vente_sku_shopify"
    ></rapport>
    <div v-if="database_config == 'testNutribe'" class="d-none">
      <span class="btn btn-sm" @click="test_message">text message ajax</span>
    </div>
  </div>
</template>

<script>
/**
 * Import des composants.
 */
import OrderProductsIdorder from "./cmpts/OrderProductsIdorder.vue";
import OrderProductsIdorder0 from "./cmpts/OrderProductsIdorder0.vue";
import FormatNumber from "./cmpts/FormatNumber.vue";
import TemplateTableFooter from "./cmpts/TemplateTableFooter.vue";
import ModalSimple from "../../Modals/ModalSimple.vue";
import Rapport from "./cmpts/Rapport.vue";
/**
 * Edit GestionBlocs.
 */
import EditRowOrderProduct from "./cmpts/EditRowOrderProduct.vue";
/**
 * Contient les bouttons pour les actions au niveau de la cellule action
 */
import TemplateTableauAction from "./cmpts/ActionOrderProduct.vue";
import Ajax from "./Ajax.vue";
/**
 * Jquery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}
export default {
  name: "OrderProducts",
  props: {
    configs: {
      type: Object,
    },
  },
  data() {
    return {
      /**
       *ajax
       */
      url_post: "",
      headers: {},
      post_datas: {},
      trigger_post_loanding: 0,
      root: $("body").attr("data-root"),
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      /**
       * Tableau
       */
      //table_rows: {},
      table_headers: {},
      //
      table_rows_v2: [],
      table_headers_v2: {},
      class_table: "light-table table-total",
      class_table2: "light-table table-unite",
      template_table_footer: "",
      table_template_tableau_action: TemplateTableauAction,
      table_show_action: false,
      /**
       *
       */
      configs_watch: {},
      /**
       * Modal simple.
       */
      actionparent: "",
      template_modal_body: "",
      modal_body: {},
      titre_modal: "",
      id_modal: "row",
      TrackingCompany: {},
      ajax_messages: {
        msg: "",
        type: "",
      },
      order_id: "",
      VueFormEdit: {},
      VueAjax: {},
      ajax_url: "/comptabilte/getcommandes.php",
      /**
       * Rapport
       */
      listes_vente_sku_shopify: [],
      listes_vente_sku_amazon: [],
      /**
       *datas
       */
      nombre_commande_a_traiter: 0,
      /**
       * Pour empecher la recharge du bloc produit a traiter si on change la date.
       */
      fullfiment_loader: false,
      databaseConfig: "",
      database_config: "",
      intervalRefresh: 120000,
      intervalid1: null,
    };
  },
  watch: {
    configs: {
      handler(val) {
        console.log(" database_config ", this.configs.databaseConfig);
        if (this.configs.databaseConfig && this.configs.databaseConfig !== "") {
          this.initConfig(this.configs.databaseConfig);
          this.database_config = this.configs.databaseConfig;
        }
        this.database_config = "";
        //
        this.table_show_action = true;
        //
        this.configs_watch = val;
      },
      deep: true,
    },
  },
  mounted() {
    console.log(" Chargement du module : OrderProducts.vue ");
    console.log(this.$refs.ajax.VueAjax);
    this.VueAjax = this.$refs.ajax.VueAjax;
    this.refreshCommandes();
  },
  components: {
    "modal-simple": ModalSimple,
    ajax: Ajax,
    rapport: Rapport,
  },
  methods: {
    refreshCommandes() {
      console.log("intervalid1");
      if (this.intervalRefresh > 5000)
        this.intervalid1 = setInterval(() => {
          console.log(" Reload datas : ", this.intervalRefresh);
          this.getDatas();
        }, this.intervalRefresh);
    },
    data_from_ajax(datas) {
      var self = this;
      console.log("OrderProducts datas : ", datas);
      if (datas.status) {
        if (datas.data.return) {
          if (datas.data.return.order_products) {
            self.buildTableaux(datas.data.return.order_products);
          }
          if (datas.data.return.TrackingCompany) {
            this.TrackingCompany = datas.data.return.TrackingCompany;
          }
          if (
            datas.data.return.orders_a_traiter ||
            datas.data.return.orders_a_traiter === 0
          ) {
            self.nombre_commande_a_traiter = datas.data.return.orders_a_traiter;
          }
        }
      }
    },
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      if (datas.return.Fulfill) {
        this.fullfiment_loader = false;
        this.VueFormEdit.setForm_is_running(false);
        this.close_modal();
        this.getDatas();
      } //
      else if (datas.return.home_page_rapport) {
        this.VueAjax.close_alert();
        this.listes_vente_sku_amazon =
          datas.return.home_page_rapport.quantites_sku_amazon;
        this.listes_vente_sku_shopify =
          datas.return.home_page_rapport.quantites_sku_shopify;
      } //
      else if (datas.return.orders_a_traiter) {
        this.nombre_commande_a_traiter = datas.return.orders_a_traiter;
      } else {
        if (this.VueFormEdit && this.VueFormEdit.setForm_is_running) {
          this.VueFormEdit.setForm_is_running(false);
        }
      }
    },
    ev_ajax_error() {
      this.VueFormEdit.setForm_is_running(false);
    },
    buildTableaux(order_products) {
      if (!order_products.length) {
        this.template_table_footer = TemplateTableFooter;
      } else {
        this.template_table_footer = "";
      }
      this.table_rows_v2 = order_products;

      this.table_headers_v2 = {
        id_order: {
          name: "id_order",
          label: "#ID commande",
          perfom: [],
          addclass_td: {
            custom: "",
          },
          templates: {
            template_tableau_cellule: OrderProductsIdorder,
          },
        },
        id_shopify: {
          name: "id_shopify",
          label: "id_shopify",
          perfom: [],
          hidden: true,
        },
        created_at: {
          name: "created_at",
          label: "Date",
          perfom: ["getMysqlDateToFrench"],
        },
        "buyer-name": {
          name: "buyer-name",
          label: "Client",
          perfom: [],
          addclass_td: {
            custom: "",
          },
        },
        montant: {
          name: "montant",
          label: "Montant",
          perfom: [],
          addclass_td: {
            custom: "",
          },
          templates: {
            template_tableau_cellule: FormatNumber,
          },
        },
        /*
        financial_status: {
          name: "financial_status",
          label: "Paiement",
          perfom: [],
          addclass_td: {
            custom: ""
          }
        },

        fulfillment_status: {
          name: "fulfillment_status",
          label: "Fulfillment",
          perfom: [],
          addclass_td: {
            custom: ""
          }
        },

        items: {
          name: "items",
          label: "Items",
          perfom: [],
          addclass_td: {
            custom: ""
          }
        },
        */
        quantite: {
          name: "quantite",
          label: "Articles",
          perfom: [],
          addclass_td: {
            custom: "",
          },
        },
      };

      this.table_headers = {
        id_order: {
          name: "id_order",
          label: "#ID commande",
          perfom: [],
          addclass_td: { custom: "" },
          templates: {
            template_tableau_cellule: OrderProductsIdorder0,
          },
        },
        id_shopify: {
          name: "id_shopify",
          label: "id_shopify",
          perfom: [],
          addclass_td: {
            custom: "d-none",
          },
        },
        created_at: {
          name: "created_at",
          label: "Date",
          perfom: ["getMysqlDateToFrench"],
        },
        "buyer-name": {
          name: "buyer-name",
          label: "Client",
          perfom: [],
          addclass_td: {
            custom: "",
          },
        },
        MCTVITALITÉ: {
          name: "MCTVITALITÉ",
          label: "VITALITE",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTPURE500: {
          name: "MCTPURE500",
          label: "PURE 500",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTPURE250: {
          name: "MCTPURE250",
          label: "PURE 250",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTCRE: {
          name: "MCTCRE",
          label: "MCTCRE",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTCREV: {
          name: "MCTCREV",
          label: "MCTCREV",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTCRECG: {
          name: "MCTCRECG",
          label: "MCTCRECG",
          perfom: [],
          addclass_td: { custom: "product" },
        },
        MCTCRE100: {
          name: "MCTCRE100",
          label: "MCTCRE100",
          addclass_td: { custom: "product" },
        },
        "COCO&GHEE500": {
          name: "COCO&GHEE500",
          label: "C&GHEE",
          addclass_td: { custom: "product" },
        },
      };
    },
    getDatas() {
      if (!this.c) {
        this.url_post = this.root + "/getcommandes.php";
        this.headers = {
          "Content-Type": "application/json",
          "X-CSRF-Token": "order_products",
          Accept: "application/json",
        };
        this.post_datas = {
          databaseConfig: this.databaseConfig,
        };
        this.trigger_post_loanding++;
      }
      this.fullfiment_loader = true;
    },
    ev_action_ev_template_tableau_action(datas) {
      this.open_modal(datas);
    },
    ev_modal_simple(datas) {
      console.log("ev_modal_simple ", datas);
      this.SaveFulfillment(datas);
    },
    /**
     * Declenche le traitement des données.
     */
    SaveFulfillment(datas) {
      this.ajax_url = "/comptabilte/getcommandes.php";
      this.VueFormEdit = this.$refs.modal_simple.$refs.cpts_modal_simple;
      this.VueFormEdit.setForm_is_running(true);
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.configs.databaseConfig,
        datas: datas,
        order_id: this.order_id, //1697165443138
      };
      this.ajax_token = "save_fulfillment";
      this.trigger_request++;
    },
    open_modal(datas) {
      var self = this;
      /**
       * si cest une nouvelle commande on vide les données
       */
      if (this.order_id !== "" && datas.ligne.id_order !== this.order_id) {
        this.VueAjax.close_alert();
        if (this.VueFormEdit && this.VueFormEdit.$attrs) {
          this.VueFormEdit.close_alert();
          console.log("fermeture alert in modal");
        }
      }
      this.modal_body = {
        datas: datas,
        TrackingCompany: this.TrackingCompany,
        ajax_messages: this.ajax_messages,
      };
      this.titre_modal = datas.ligne.id_shopify
        ? datas.ligne.id_shopify + "(" + datas.ligne.id_order + ")"
        : datas.ligne.id_order;
      this.titre_modal = "Traitement commande : " + this.titre_modal;

      this.order_id = datas.ligne.id_order;
      console.log("this.modal_body : ", this.modal_body);
      this.template_modal_body = EditRowOrderProduct;
      $("#" + self.formated_id_modal).modal("show");
      $("#" + self.formated_id_modal).on("shown.bs.modal", function () {
        $("#" + self.formated_id_modal).off("shown.bs.modal");
        console.log("modal open, add focus.");
        $('[data_name="tracking_number"] input').focus();
      });
    },
    close_modal() {
      $("#" + this.formated_id_modal).modal("hide");
    },
    test_message() {
      this.ajax_url = "/comptabilte/ajax-request.php";
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.configs.databaseConfig,
      };
      this.ajax_token = "test_message_ajax";
      this.trigger_request++;
    },
    getRapport() {
      this.ajax_url = "/comptabilte/getcommandes.php";
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        configs: this.configs,
        filters: this.configs.filters,
      };
      this.ajax_token = "home_page_rapport";
      this.trigger_request++;
    },
    initConfig(databaseConfig) {
      this.databaseConfig = databaseConfig;
      this.getDatas();
      this.getRapport();
    },
    /**
     * Recupere le nombre de comande restante à traiter.
     * ( pas utile car getDatas() recuepere deja ce nombre ).
     * @ à supprimer.
     */
    RecupereNombreCommandeATraiter() {
      this.ajax_url = "/comptabilte/getcommandes.php";
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        configs: this.configs,
        filters: this.configs.filters,
      };
      this.ajax_token = "order_products_commandes_restants";
      this.trigger_request++;
    },
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-" + this.id_modal;
      },
    },
    nombre_commande_a_traiter_display: {
      get() {
        if (this.nombre_commande_a_traiter === 1) {
          return this.nombre_commande_a_traiter + " commande à traiter";
        } else if (this.nombre_commande_a_traiter > 0) {
          return this.nombre_commande_a_traiter + " commandes à traiter";
        }
        return "Toutes les commandes sont traitées";
      },
    },
  },
};
</script>

<style lang="scss">
.card-light table tr td:first-child {
  width: auto !important;
}
.light-table {
  .table-header th {
    background: none;
    border: none;
    border-left: solid 2px #7d7d7d;
    position: sticky;
    top: 65px;
    background: #f5f5f5;
  }
  tbody tr td {
    border-left: dashed 2px #7d7d7d;
    vertical-align: middle;
  }
  tbody tr td.product {
    width: 110px;
    font-weight: 600;
    font-size: 20px;
  }
  tbody tr:hover {
    background: #f4f6f8;
    cursor: pointer;
  }
}
.table-total {
  tbody tr:last-child {
    display: none;
  }
}
.table-unite {
  td.product {
    text-align: center;
  }
  .product {
    padding: 5px 5px;
  }
  tbody {
    tr:last-child td {
      font-weight: 600;
      background-color: #e0e3f7;
      &:last-child * {
        display: none;
      }
    }
  }
}
</style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/OrderProducts.vue
-->
