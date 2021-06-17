<template>
  <div>
    <div class="d-none">
      Commande :
      <strong>{{ modal_body.id_order }}</strong>
    </div>
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
    <div class="alert_static_message">
      <alert
        @ev_alert_action="alert_action"
        :alert_message="alert_message_static"
        :show_alert="show_alert_static"
        :alert_attribut_class="alert_attribut_class_static"
        @ev_alert_close="alert_close_static"
        :alert_template="alert_template"
        :datas="{ use_next_code_DocNumber: use_next_code_DocNumber }"
      ></alert>
      <div class="d-none">
        <pre
          v-if="flux && modedebug > 0 && modal_body.modedebug > 0"
          v-html="flux"
        ></pre>
        <pre
          v-if="querys && modedebug > 0 && modal_body.modedebug > 0"
          v-html="querys"
        ></pre>
      </div>
    </div>
    <div v-if="order_bd.qb_doc_number">
      <div class="d-flex">
        <h4>
          Facture n
          <sup style="font-size: 60%;">o</sup>
          {{ order_bd.qb_doc_number }}
          <span v-if="order_bd.qb_payment_number">
            , Paiement n
            <sup style="font-size: 60%;">o</sup>
            {{ order_bd.qb_payment_number }}
          </span>
          <span class="text-danger" v-if="!show_void_invoice && show_text_void">
            ANNULÉE
          </span>
        </h4>
      </div>
    </div>
    <div v-if="account.name">
      <div class="mb-2 d-flex justify-content-between">
        <strong v-html="account.name"></strong>
        <span v-html="account.TransactionLocationType"></span>
      </div>
    </div>
    <div v-if="invoice.Line || cart_array[0]" class="mb-4">
      <h3 v-if="modal_body.modedebug > 0">
        <span class="btn-group btn-group-sm float-right" role="group">
          <span
            class="btn btn-sm"
            v-bind:class="[
              modedebug > 0 ? 'btn-outline-primary' : 'btn-primary'
            ]"
            @click="select_tab"
            data-modedebug="-1"
            >Normal</span
          >
          <span
            class="btn btn-sm"
            v-bind:class="[
              modedebug > 0 ? 'btn-primary' : 'btn-outline-primary'
            ]"
            @click="select_tab"
            data-modedebug="1"
            >DEBUG</span
          >
        </span>
      </h3>
      <table class="table table-striped table-cart">
        <thead>
          <tr>
            <th>#Line</th>
            <th>Sku</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Montant TTC</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(colonnes, index) in cart_array" :key="index">
            <td>{{ index++ }}</td>
            <td
              v-for="(col, ind) in cart_header"
              v-html="colonnes[ind]"
              :key="ind"
            ></td>
          </tr>
        </tbody>
      </table>
      <div class="mt-3 d-none" v-if="discount.code">
        <table class="table table-striped table-cart">
          <thead>
            <tr>
              <th>Discount code</th>
              <th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ discount.code }}</td>
              <td>{{ discount.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 d-flex flex-wrap sous-totals" v-if="sub_total">
        <p class="d-flex w-100 justify-content-end">
          <span>Sous-total TTC</span>
          <span>{{ sub_ttc | currency }}</span>
        </p>
        <p class="d-flex w-100 justify-content-end">
          <span>
            Remise globale
            <br />
            {{ discount.code }}
          </span>
          <span>{{ sub_discount | currency }}</span>
        </p>
        <p class="d-flex w-100 justify-content-end">
          <span>Frais de port</span>
          <span>{{ sub_shipping_total | currency }}</span>
        </p>
        <p class="d-flex w-100 justify-content-end">
          <span>Total TTC</span>
          <span>{{ sub_total | currency }}</span>
        </p>
      </div>

      <pre
        v-if="modal_body.modedebug > 0 && (invoice.Line || invoice.CustomerRef)"
        >{{ invoice }}</pre
      >
      <pre v-if="modal_body.modedebug > 0 && payments.PaymentRefNum">{{
        payments
      }}</pre>
    </div>
    <div class="d-flex justify-content-between mb-4 mb-2">
      <div
        class="d-flex flex-wrap margin-bottom-item"
        v-if="modal_body.modedebug > 0"
      >
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="test_invoice"
          v-if="modedebug > 0"
        >
          JSON Facture
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <create-customer-qb
          v-if="modedebug > 0 && current_compagny == '9130347038344016'"
          :configs="modal_body"
          :plateforme="modal_body.plateforme"
          @ev_create_customer_v2="create_customer_v2"
        ></create-customer-qb>
        <!-- <button class="btn btn-outline-success btn-sm mr-4" @click="create_invoice_test" > Mode test <i class="fas fa-sync d-none fa-spin "></i></button> -->
        <!-- <button class="btn btn-outline-success btn-sm mr-4" @click="create_invoice_andpayement_test" > Mode test <i class="fas fa-sync d-none fa-spin "></i></button> -->
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="create_invoice_test"
        >
          Créer la facture
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="valider_payment_test"
        >
          Valider le payment
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="void_invoice"
          v-if="show_void_invoice"
        >
          Annuler la facture
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <button
          class="btn btn-outline-success btn-sm mr-4 d-none"
          @click="create_salereceipt"
        >
          Creer le réçu
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
      </div>

      <div
        class="d-flex flex-wrap margin-bottom-item"
        v-if="!(modal_body.modedebug > 0)"
      >
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="create_invoice_all"
          v-if="show_create_invoice"
        >
          Créer la facture
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <button
          class="btn btn-outline-success btn-sm mr-4"
          @click="void_invoice"
          v-if="show_void_invoice"
        >
          Annuler la facture
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
        <button
          class="btn btn-outline-success btn-sm mr-4 d-none"
          @click="create_invoice_all_next_code_facture"
          v-if="show_create_invoice"
          id="create-invoice-all-next-code-facture"
        >
          Réessayer avec le numéro suivant
          <i class="fas fa-sync d-none fa-spin"></i>
        </button>
      </div>

      <div class="d-flex">
        <div>
          <button
            class="btn btn-outline-success btn-sm"
            @click="get_token"
            v-if="!token_url_refresh"
          >
            get the token to refresh
            <i class="fas fa-sync d-none fa-spin"></i>
          </button>
          <span
            :href="token_url_refresh"
            class="btn btn-outline-success btn-sm ml-4"
            v-if="token_url_refresh"
            @click="open_windows"
            >Refresh token</span
          >
        </div>
      </div>
    </div>
    <!-- check Flux -->
    <accordion
      class="mb-4"
      :accordions="accordions"
      :accordion_id="'accordion_flux_datas'"
      :template_accordion="'custom_display'"
      v-if="modedebug > 0"
    ></accordion>
  </div>
</template>

<script>
import Ajax from "../Ajax.vue";
/**
 * Jquery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}

/**
 * Retourne la valeur d'un cookie.
 */
function getSession(key) {
  return window.Cookies.get(key);
}

/**
 * Enregistre une donnée en session.
 */
function saveSession(key, value) {
  return window.Cookies.set(key, value);
}

export default {
  name: "CreateOrder",
  props: {
    modal_body: {
      type: [Object, Array, String, Number],
      default: function() {
        return {
          update: false,
          delete: false,
          move: false,
          drap: false
        };
      }
    },
    show_save: {
      type: Boolean,
      default: true
    },
    // action button
    // show_add:{type: Boolean,default: true,},
    doaction: [Object, Array, String, Number],
    titre_modal: [Object, Array, String, Number]
  },
  data: function() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_url: "",
      ajax_messages: {
        msg: "",
        type: ""
      },
      /**
       *
       */
      modedebug: -1,
      /**
       * Alert message
       */
      alert_message_static: "",
      show_alert_static: false,
      alert_attribut_class_static: "alert-primary",
      /**
       *
       */
      token_url_refresh: null,
      /**
       *
       */
      invoice: {},
      invoice_result: {},
      salereceipt: {},
      salereceipt_result: {},
      cart_header: {
        sku: "Sku",
        price: "Prix",
        qty: "Quantité",
        ttc: "Montent TTC"
      },
      cart_array: [],
      sub_ttc: false,
      sub_discount: false,
      sub_shipping_total: false,
      sub_total: false,
      discount: {},
      order_bd: {},
      status_invoice: false,
      status_payment: false,
      id_invoice: null,
      /**
       * payment
       */
      payments: {},
      /**
       * account
       */
      account: {},
      /**
       *
       */
      flux: 0,
      querys: 0,
      /**
       *
       */
      accordions: [],
      /**
       * Message d'erreur supplementaire
       */
      error_message: "",
      alert_template: "",
      /**
       *
       */
      all_datas_form_cart: {},
      show_void_invoice: false,
      show_text_void: false,
      show_create_invoice: false,

      /**
       * Compte QB actif;
       */
      current_compagny: "",
      /**
       * mode dev
       */
      dev_evolution: "stable",
      /**
       * Customer_account
       */
      customer_account_shopify: false,
      customer_account_amazon: false,
      SalesTermRef: false,
      DepositToAccountRef_compte_principal: false,
      DepositToAccountRef_compte_paypal: false,
      ModeCalculDiscountGlobal: false,
      use_next_code_DocNumber: 0,
      /**
       * event
       */
      click_event: {}
    };
  },
  components: {
    ajax: Ajax
  },
  mounted: function() {
    if (!this.token_url_refresh) {
      var event = $(".modal-header");
      this.get_token(event);
    }
    /**
     * Get mode
     */
    this.modedebug = parseInt(getSession("createorder_modedebug"));
  },
  watch: {
    doaction: function() {
      // applique la configurationen function de la compagny QB.
      this.appliConfig();
      this.cart_array = [];
      this.account = {};
      this.getCart();
      this.resetFields();
      //console.log('datas to send or config : ', this.modal_body);
      // console.log('get_modedebug : ', this.get_modedebug);
    }
  },
  methods: {
    appliConfig: function() {
      /**
       * Get current compte QB.
       */
      var current_compagny = this.modal_body.current_compagny;
      if (current_compagny) {
        this.current_compagny = current_compagny;
      }

      if (this.current_compagny == "9130347038344016") {
        this.customer_account_shopify = 100;
        this.customer_account_amazon = 101;
        this.SalesTermRef = 5; // 3;
        this.DepositToAccountRef_compte_principal = 66;
        this.DepositToAccountRef_compte_paypal = 102;
        this.ModeCalculDiscountGlobal = true;
      }
      //
      var dev_evolution = getSession("dev_evolution");
      if (dev_evolution && this.current_compagny != "9130347044451506") {
        this.dev_evolution = dev_evolution;
      }
    },
    resetFields: function() {
      this.alert_message_static = "";
      this.show_alert_static = false;
      this.invoice = {};
      this.discount = {};
      this.order_bd = {};
      this.status_invoice = false;
      this.payments = {};
      this.flux = 0;
      this.querys = 0;
      this.accordions = [];
      this.all_datas_form_cart = {};
    },
    create_invoice: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_invoice");
    },
    create_invoice_test: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_invoice_test");
    },
    create_customer_test: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_customer_test");
    },
    create_customer: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_customer");
    },
    update_customer_test: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "update_customer_test");
    },
    update_customer: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "update_customer");
    },
    create_invoice_andpayement_test: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_invoice_andpayement_test");
    },
    create_invoice_all: function() {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_invoice_all");
    },
    create_invoice_all_next_code_facture: function() {
      this.resetFields();
      var datas = this.modal_body;
      this.use_next_code_DocNumber++;
      datas.use_next_code_DocNumber = this.use_next_code_DocNumber;
      this.execute_action(event, datas, "create_invoice_all_next_code_facture");
    },

    test_invoice: function() {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "test_invoice");
      this.show_alert_msg = true;
    },
    create_salereceipt: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "create_salereceipt");
    },
    get_token: function(event) {
      var datas = {};
      this.execute_action(event, datas, "get_token", false, true, false);
      /*
      if (DatasReturn.results) {
        this.token_url_refresh = DatasReturn.results;
      } else {
        console.log("error token");
      }
      */
    },
    getInvoice: function() {
      var datas = this.modal_body;
      var event = {
        target: $("#model-create-invoice .modal-header")
      };
      this.execute_action(event, datas, "get_invoice", true, false);
    },
    getCart: function() {
      var datas = this.modal_body;
      this.show_void_invoice = false;
      var event = {
        target: $("#model-create-invoice .modal-header")
      };
      this.execute_action(event, datas, "get_cart", true, false);
      //
    },
    valider_payment: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "valide_payment");
    },
    valider_payment_test: function(event) {
      this.resetFields();
      var datas = this.modal_body;
      this.execute_action(event, datas, "valider_payment_test");
    },
    void_invoice: function() {
      var self = this;
      /**
       * add status commande and id facture
       */
      console.log(self.all_datas_form_cart);
      if (self.all_datas_form_cart.cart) {
        this.modal_body["dafault"] = {};
        this.modal_body["dafault"]["id_invoice"] =
          self.all_datas_form_cart.id_invoice;
        this.modal_body["dafault"]["status_invoice"] =
          self.all_datas_form_cart.status_invoice;
      }
      this.resetFields();
      console.log(this.modal_body);
      var datas = this.modal_body;
      this.execute_action(event, datas, "void_invoice");
    },
    execute_action(event, datas, action = "get_invoice") {
      var self = this;
      this.click_event = event;
      this.ajax_token = action;
      console.log("Load content AJAX : ", datas);
      $(".fa-sync", event.target).removeClass("d-none");
      $(event.target).attr("disabled", "true");
      // console.log(datas);
      var url = "/quickbookstest/quickbook.php";
      if ("/sandbox/comptabilte/" == window.location.pathname) {
        url = "/sandbox/quickbookstest/quickbook.php";
      }
      this.ajax_url = url;
      /**
       * Ajout de l'id du compte.
       */
      // datas['current_compagny'] = self.current_compagny;
      datas["customer_account_shopify"] = self.customer_account_shopify;
      datas["customer_account_amazon"] = self.customer_account_amazon;
      datas["SalesTermRef"] = self.SalesTermRef;
      datas["DepositToAccountRef_compte_principal"] =
        self.DepositToAccountRef_compte_principal;
      datas["DepositToAccountRef_compte_paypal"] =
        self.DepositToAccountRef_compte_paypal;
      datas["ModeCalculDiscountGlobal"] = self.ModeCalculDiscountGlobal;
      datas["dev_evolution"] = self.dev_evolution;
      this.data_post = datas;
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      var self = this;
      this.stop_icon_sync();
      self.alert_template = "";
      self.use_next_code_DocNumber = 0;
      /**
       * token
       */
      if (datas.token == "get_token") {
        if (datas.results) {
          this.token_url_refresh = datas.results;
        } else {
          console.log("impossible d'obtenir le token ");
        }
      } //
      /**
       * create_invoice
       */
      else if (datas.token == "create_invoice") {
        //
      } //
      /**
       * get_cart
       */
      else if (datas.token == "get_cart") {
        self.all_datas_form_cart = datas.buildCart;
        if (self.all_datas_form_cart && self.all_datas_form_cart.id_invoice) {
          self.show_create_invoice = false;
          var qb_voided = parseInt(self.all_datas_form_cart.order_bd.qb_voided);
          if (!qb_voided) {
            self.show_void_invoice = true;
          } else {
            self.show_text_void = true;
          }
        } else {
          self.show_create_invoice = true;
        }
        //
        if (
          (datas.cart_order &&
            datas.cart_order.admin_graphql_api_id &&
            datas.cart_order.line_items) ||
          datas.buildCart["cart"]
        ) {
          self.cart_array = datas.buildCart["cart"];
          // console.log(datas.buildCart);
          self.discount = datas.buildCart["discount"];
          self.order_bd = datas.buildCart["order_bd"];
          if (datas.buildCart) {
            self.sub_ttc = datas.buildCart.sub_ttc;
            self.sub_discount = datas.buildCart.sub_discount;
            self.sub_shipping_total = datas.buildCart.sub_shipping_total;
            self.sub_total = datas.buildCart.sub_total;
          }
        } else {
          var cart = [];
          $.each(datas.cart_order, function(j, l) {
            var subCart = {
              sku: l.SELLER_SKU,
              price: l.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
              qty: l.QTY
            };
            cart.push(subCart);
          });
          self.cart_array = cart;
        }
        //
        if (datas.buildCart.account) {
          /**
           * commande :WithinFrance 1067126390850
           * commande :OutsideFranceWithEU
           * 1083080736834 1084228108354
           */
          if (
            datas.buildCart.account.TransactionLocationType == "WithinFrance"
          ) {
            datas.buildCart.account.TransactionLocationType = "France";
            self.account = datas.buildCart.account;
          } else if (
            datas.buildCart.account.TransactionLocationType == "FranceOverseas"
          ) {
            datas.buildCart.account.TransactionLocationType = "DOM-TOM";
            self.account = datas.buildCart.account;
          } else if (
            datas.buildCart.account.TransactionLocationType ==
            "OutsideFranceWithEU"
          ) {
            datas.buildCart.account.TransactionLocationType = "UE";
            self.account = datas.buildCart.account;
          } else if (
            datas.buildCart.account.TransactionLocationType == "OutsideEU"
          ) {
            datas.buildCart.account.TransactionLocationType = "INTERNATIONAL";
            self.account = datas.buildCart.account;
          }
        }
      } //
      /**
       * Test_invoice
       */
      else if (datas.token == "test_invoice") {
        self.invoice_result = datas.invoice_result;
        self.accordions.push({
          title: "Facture JSON ",
          body: datas.invoice_result
        });
      }
    },
    ev_ajax_error(datas) {
      console.log("ev_ajax_error : ", datas);
      this.stop_icon_sync();
    },
    stop_icon_sync() {
      var event = this.click_event;
      $(".fa-sync", event.target).addClass("d-none");
      $(event.target).removeAttr("disabled");
    },
    alert_action: function(datas) {
      console.log(datas);
    },
    alert_close_static: function() {
      this.show_alert_static = false;
    },
    create_customer_v2: function(datas) {
      var self = this;
      console.log("thme create order : ", datas);
      if (datas.results) {
        if (datas.results.status) {
          if (datas.results.data) {
            $.each(datas.results.data, function(i, v) {
              if (v.type && v.type == "create_customer") {
                var message = "";
                if (v.is_new) {
                  message =
                    '<strong class="d-block">Client crée : ' +
                    v.value.DisplayName +
                    "</strong>";
                } else {
                  message =
                    '<strong class="d-block">Le client existe deja : ' +
                    v.value.DisplayName +
                    "</strong>";
                }
                self.successAjax(message);

                self.alert_attribut_class_static = "alert-success";
              }
            });
          }
        } else {
          this.errorAjax(datas.results.errorajax);
        }
      }
    },
    open_windows: function() {
      // alert('open_windows off');
      // return false;
      var w = 770,
        h = 600,
        l = (screen.availWidth - w) / 2,
        t = (screen.availHeight - h) / 2;
      console.log("hello : " + this.token_url_refresh);
      window.open(
        this.token_url_refresh,
        "window",
        "width= " +
          w +
          ",height=" +
          h +
          ",left=" +
          l +
          ",top=" +
          t +
          ", scrollbars = yes, location = no, toolbar = no, menubar = no, status = no"
      );
      return false;
    },
    select_tab: function(e) {
      var self = this;
      self.resetFields();
      // $(e.target).parent().find('.btn').removeClass('btn-primary').addClass('btn-outline-primary');
      // $(e.target).removeClass('btn-outline-primary');
      // $(e.target).addClass('btn-primary');
      var attr_mode = parseInt($(e.target).attr("data-modedebug"));
      console.log(attr_mode);
      if (attr_mode < 0) {
        // console.log('attr_mode : ',attr_mode);
        self.modedebug = -1;
        // console.log('modedebug false ');
      } else {
        self.modedebug = 1;
        // console.log('modedebug true ');
      }
      /**
       * save mode
       */
      saveSession("createorder_modedebug", self.modedebug);
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/cmpts/CreateOrder.vue
-->
