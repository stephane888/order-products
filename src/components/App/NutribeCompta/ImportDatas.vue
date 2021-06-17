<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :params="data_get"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="false"
      :method="method"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
      :messages="ajax_messages"
      :url="ajax_url"
      ref="ajax"
    ></ajax>
    <!--
/**
 * Rapport des paiements:
 * Table utilisé : amazon-payments et amazon-settlement
 * Les fichiers sont dans : amazon-file-import
 */
-->
    <section>
      <h4 data-type="settlement-id" data-bd-name="amazon-line-items">
        Rapport des paiements
      </h4>
      <div class="card card-light mt-3 mb-4">
        <h5 class="card-header">Historique</h5>
        <div class="card-body">
          <table class="table table-bordered table-striped table-td-25">
            <thead class="thead-light">
              <tr>
                <th class="col-4">Nom du fichier</th>
                <th class="col-4">Date debut</th>
                <th class="col-4">Date fin</th>
                <th class="col-4">Date import</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(flux, index) in flux_amazon" :key="index">
                <td>
                  <a href="#">{{ flux.filename }}</a>
                </td>
                <td>{{ flux["file-debut"] }}</td>
                <td>{{ flux["file-fin"] }}</td>
                <td>{{ flux["date-import"] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card card-light mt-3 mb-4">
        <h5 class="card-header">Importer un fichier (.csv)</h5>
        <div class="card-body">
          <form id="fupFormUploadDnFicale" class="m-0">
            <div class="form-group">
              <label for="fileUpload_payement">Fichier</label>
              <input
                type="file"
                class="form-control"
                id="fileUpload_payement"
                name="mycustomfile"
                accept=".txt, .csv"
              />
            </div>
            <a
              class="float-right text-info"
              href="/comptabilte/docs/13933734551017876.csv"
              >Example de fichier</a
            >
            <button
              type="submit"
              name="submit"
              class="btn btn-info submitBtn"
              id="validSubmit22"
              @click.prevent="load_files($event, 'payement')"
            >
              Importer
              <i
                v-if="icon_amazon_payement"
                class="fas fa-sync-alt ml-2 fa-spin"
              ></i>
            </button>
          </form>
        </div>
      </div>

      <alert_new
        v-if="type == 'payement'"
        :show_alert="show_alert"
        :alert_id_html="alert_id_html"
        :alert_message="''"
        :alert_attribut_class="'alert-' + alert_messages_type"
        @ev_alert_close="ev_alert_close"
      >
        <strong>
          {{ ajax_messages.msg }}
        </strong>
        <div v-html="textes_messages"></div>
      </alert_new>
      <!--
      <div
        class="card card-light mt-3 mb-4"
        v-if="type == 'payement' && textes.length"
      >
        <div class="card-body">
          <div v-for="(texte, index) in textes" :key="index">
            <div v-html="texte"></div>
          </div>
        </div>
      </div>
    --></section>
    <pre class="d-none"> {{ header_file }} </pre>

    <!--
    /**
 * Rapport des paiements:
 * Table utilisé : amazon-line-items;
 * Les fichiers sont dans : amazon-file-import.
 */
-->
    <hr />
    <section>
      <h4 data-bd-name="amazon-payments">Expéditions effectuées par Amazon</h4>
      <div class="card card-light mt-3 mb-4">
        <h5 class="card-header">Historique</h5>
        <div class="card-body">
          <table class="table table-bordered table-striped table-td-25">
            <thead class="thead-light">
              <tr>
                <th>Nom du fichier</th>
                <th>Date debut</th>
                <th>Date fin</th>
                <th>Date import</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(flux, index) in flux_amazon_complet" :key="index">
                <td>
                  <a href="#">{{ flux.filename }}</a>
                </td>
                <td>{{ flux["file-debut"] }}</td>
                <td>{{ flux["file-fin"] }}</td>
                <td>{{ flux["date-import"] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card card-light mt-3 mb-4">
        <h5 class="card-header">Importer un fichier (.csv)</h5>
        <div class="card-body">
          <form id="fupFormUploadFile_0" class="m-0">
            <div class="form-group">
              <label for="fileUpload_expedition">Fichier</label>
              <input
                type="file"
                class="form-control"
                id="fileUpload_expedition"
                name="fileflux_amazon_complet"
                accept=".txt, .csv"
              />
            </div>
            <a
              class="float-right text-info"
              href="/comptabilte/docs/18305766933018187.csv"
            >
              Example de fichier
            </a>
            <button
              type="submit"
              name="submit"
              class="btn btn-info submitBtn"
              id="validSubmit"
              @click.prevent="load_files($event, 'expedition')"
            >
              Importer
              <i
                v-if="icon_amazon_expedition"
                class="fas fa-sync-alt ml-2 fa-spin"
              ></i>
            </button>
          </form>
        </div>
      </div>
      <alert_new
        v-if="type == 'expedition'"
        :show_alert="show_alert"
        :alert_id_html="alert_id_html"
        :alert_message="''"
        :alert_attribut_class="'alert-' + alert_messages_type"
        @ev_alert_close="ev_alert_close"
      >
        <strong>
          {{ ajax_messages.msg }}
        </strong>
        <div v-html="textes_messages"></div>
      </alert_new>
      <!--
      <div
        class="card card-light mt-3 mb-4"
        v-if="type == 'expedition' && textes.length"
      >
        <div class="card-body">
          <div v-for="(texte, index) in textes" :key="index">
            <div v-html="texte"></div>
          </div>
        </div>
      </div>
    -->
      <div id="flux-amason-complet"></div>
    </section>
  </div>
</template>

<script>
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
 * definition de papa;
 */
var Papa;
if (window.Papa) {
  Papa = window.Papa;
}

import Ajax from "./Ajax.vue";
import Alert from "../../Alert/index.vue";
export default {
  name: "ImportDatas",
  data: function() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      ajax_messages: {
        msg: "",
        type: ""
      },
      ajax_url: "",
      method: "POST",
      data_get: {},
      Vue_ajax: {},
      /**
       * Alert
       */
      show_alert: true,
      alert_id_html: "alert-id-html-0125",
      alert_messages_type: "primary",
      /**
       *
       */
      flux_amazon: [],
      flux_amazon_complet: [],
      header_file: [],
      file_array: [],
      /**
       * La premiere et derniere ligne ligne de données
       */
      first_ligne: [],
      last_ligne: [],
      textes: [],
      type: "",
      configs: {},
      filters: [],
      prefix_url: "",
      click_event: null,
      icon_amazon_payement: false,
      icon_amazon_expedition: false,
      /**
       * Nombre de ligne dans le fichier.
       */
      nombre_ligne: 0
    };
  },
  mounted() {
    this.Vue_ajax = this.$refs.ajax.$refs.ajax;
    //console.log("this.Vue_ajax : ", this.Vue_ajax);
  },
  components: {
    ajax: Ajax,
    alert_new: Alert
  },
  methods: {
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      this.show_alert = true;
      this.alert_messages_type = "success";
      if (datas.flux_amazon && datas.flux_amazon_complet) {
        this.show_alert = false;
        this.flux_amazon = datas.flux_amazon;
        this.flux_amazon_complet = datas.flux_amazon_complet;
      } //
      else if (datas.token == "put_csv_flux_payement") {
        this.icon_amazon_payement = false;
        if (datas.return && datas.return.textes) {
          this.textes = datas.return.textes;
        }
        //this.ChargeLesFichiersExistants();
      } //
      else if (datas.token == "put_csv_flux_amazon_complet") {
        this.icon_amazon_expedition = false;
        if (datas.textes) {
          this.textes = datas.textes;
        }
        //this.ChargeLesFichiersExistants();
      } else {
        this.icon_amazon_expedition = false;
        this.icon_amazon_payement = false;
      }
    },
    ev_ajax_error(datas) {
      console.log("ev_ajax_error : ", datas);
      this.show_alert = true;
      this.icon_amazon_payement = false;
      this.icon_amazon_expedition = false;
      this.alert_messages_type = "warning";
      if (datas.data && datas.data.token == "put_csv_flux_payement") {
        if (datas.data && datas.data.return && datas.data.return.textes) {
          this.textes = datas.data.return.textes;
        }
      } //
      else if (
        datas.data &&
        datas.data.token == "put_csv_flux_amazon_complet"
      ) {
        if (datas.data.textes) {
          this.textes = datas.data.textes;
        }
      }
    },
    /**
     * Cette methode n'est pas à reproduire pour d'autre, car les routes doivent etre MAJ (plus tard), de /savefile.php => requets.php.
     *
     */
    manage_connect(datas) {
      this.configs = datas;
      /**
       * On verifie si nous sommes en prod ou pas.
       */
      switch (datas.databaseConfig) {
        case "prodNutribe":
          if (window.location.pathname === "/sandbox/comptabilte/") {
            this.prefix_url = "/sandbox/comptabilte";
          } else {
            this.prefix_url = "/comptabilte";
          }
          break;
        default:
          if (window.location.host === "mynutribe-sandbox.kksa") {
            //this.url = "/comptabilte/requets.php";
            this.prefix_url = "/comptabilte";
          } else {
            //this.url = "/sandbox/comptabilte/requets.php";
            this.prefix_url = "/sandbox/comptabilte";
          }
      }
      console.log(
        "this.prefix_url : ",
        this.prefix_url,
        " window.pathname : ",
        window.location.pathname
      );
      this.ChargeLesFichiersExistants();
    },
    ChargeLesFichiersExistants() {
      var self = this;
      this.method = "GET";
      this.ajax_url = this.prefix_url + "/getcommandes.php";
      this.data_get = {
        datas: {
          config: {
            page: 1,
            nombre: 20,
            datatype: "BD_import",
            databaseConfig: this.configs.databaseConfig
          },
          filters: self.filters
        }
      };
      this.trigger_request++;
    },
    executeajax: function(event, datas, action) {
      $("i", event.target).removeClass("d-none");
      $("i", event.target).addClass("fa-spin text-warning");
      if (action == "put_csv_flux_payement") {
        this.icon_amazon_payement = true;
      } else if (action == "put_csv_flux_amazon_complet") {
        this.icon_amazon_expedition = true;
      }
      //
      this.method = "POST";
      this.ajax_url = this.prefix_url + "/savefile.php";
      this.data_post = {
        datasfiles: datas,
        databaseConfig: this.configs.databaseConfig,
        nombre_ligne: this.nombre_ligne
      };
      this.ajax_token = action;
      this.trigger_request++;
    },
    load_files: function(event, type) {
      this.click_event = event;
      var self = this;
      var file = [];
      self.type = type;
      self.textes = [];
      this.show_alert = false;
      this.ajax_messages.msg = "";
      this.ajax_messages.type = "";
      this.Vue_ajax.show_alert = false;
      if (self.type == "payement") {
        file = $("#fileUpload_payement");
      } else if (self.type == "expedition") {
        file = $("#fileUpload_expedition");
      }
      console.log(file);
      self.readFile(file);

      /**
       * $.when()).then(function(){ // validation du fichier
       * if(!self.valideFieldFile()){ console.log('file ligne : ',
       * self.file_array); self.executeajax(event,
       * {filename:self.file_name, file_data:self.file_array},
       * action='put_csv_flux_payement', asyn=true); }else{
       * alert("Erreur"); } });
       */
    },
    readFile: function(file) {
      this.alert_messages_type = "warning";
      var self = this;
      if (file && file[0] && file[0].files && file[0].files[0]) {
        console.log(file[0].files);
        this.file_name = file[0].files[0].name;
        readfile_int(file[0].files[0]);
      } else {
        this.show_alert = true;
        self.textes.push("<h4> Fichier vide </h4>");
        return false;
      }

      function readfile_int(file) {
        console.log(file.type);
        if (file.type == "text/csv") {
          self.readCsv(file);
          return true;
        } else if (file.type == "text/plain") {
          self.readText(file);
          return true;
        } else {
          this.show_alert = true;
          self.textes.push("<h4>type de fichier non pris en chage</h4>");
        }
        return false;
      }
    },
    readCsv: function(file) {
      //console.log(file);
      var self = this;
      Papa.parse(file, {
        config: {
          // base config to use for each file
        },
        complete: function(results) {
          // executed after all files are complete
          // console.log("Parsing complete:", results, file);
          if (results.errors.length == 0) {
            self.header_file = results.data[0];
            self.file_array = results.data;
            self.nombre_ligne = results.data.length;
            console.log("self.nombre_ligne ", self.nombre_ligne);
            self.valideFieldFile();
          } else {
            alert("Erreur de lecture du fichier CSV");
          }
        }
      });
    },
    readText: function(file) {
      console.log(file);
      var self = this;
      Papa.parse(file, {
        config: {
          // base config to use for each file
        },
        complete: function(results) {
          // executed after all files are complete
          // console.log("Parsing complete:", results, file);
          if (results.errors.length == 0) {
            self.header_file = results.data[0];
            self.file_array = results.data;
            self.nombre_ligne = results.data.length;
            console.log("self.nombre_ligne ", self.nombre_ligne);
            self.valideFieldFile();
          } else {
            alert("Erreur de lecture du fichier CSV");
          }
        }
      });
    },
    valideFieldFile: function() {
      var self = this;
      var headers = this.headersFile();

      var event = this.click_event;
      var prepare_error = function(error_fields, success_fields) {
        self.show_alert = true;
        self.textes.push(
          '<div class="alert alert-warning" role="alert"><h4> Structure du fichier non valide </h4> <p> Le fichier doit etre csv avec les memes identifiants </p> </div>'
        );
        if (error_fields != "") {
          self.textes.push(
            '<span>les champs : <strong class="text-danger">' +
              error_fields.trimRight(" ") +
              "</strong> sont manquant</span>"
          );
        }
        if (success_fields != "") {
          self.textes.push(
            '<span>les champs : <strong class="text-success">' +
              success_fields.trimRight(" ") +
              "</strong> sont ok</span>"
          );
        }
      };
      self.checkErrorInfieldColumn(headers).then(function(result) {
        if (result.error) {
          if (self.type == "expedition") {
            /**
             * on verifie avec le deuxsieme type de fichier.
             */
            headers = self.headerNewFile();
            self.checkErrorInfieldColumn(headers).then(function(result2) {
              if (result2.error) {
                prepare_error(result2.error_fields, result2.success_fields);
              } else {
                var ruuning = async function() {
                  await self.addColumnsDatas("purchase-date", "payments-date");
                  await self.addColumnsDatas(
                    "amazon-order-id",
                    "shipment-item-id"
                  );

                  var columns = [
                    "shipping-price",
                    "shipping-tax",
                    "item-promotion-discount",
                    "ship-promotion-discount",
                    "gift-wrap-price",
                    "gift-wrap-tax",
                    "item-price",
                    "item-tax"
                  ];
                  await self.formatCelluleDecimal(columns);

                  await self.addColumns("amazon-order-item-id", "");
                  await self.addColumns("buyer-email", "");
                  await self.addColumns("buyer-name", "");
                  await self.addColumns("ship-address-1", "");
                  await self.addColumns("ship-address-2", "");
                  await self.addColumns("ship-address-3", "");
                  await self.addColumns("bill-address-1", "");
                  await self.addColumns("bill-address-2", "");
                  await self.addColumns("bill-address-3", "");

                  await self.RenameColumnsDatas("quantity", "quantity-shipped");
                  self.file_array = await self.filterDatas();
                  await self.formatFieldItemPrice();
                  /**/
                  console.log(
                    "After formatege header : ",
                    self.file_array[0],
                    "\n datas ",
                    self.file_array
                  );
                  self.executeajax(
                    event,
                    {
                      filename: self.file_name,
                      file_data: self.file_array
                    },
                    "put_csv_flux_amazon_complet"
                  );
                };
                ruuning();
              }
            });
          } else {
            prepare_error(result.error_fields, result.success_fields);
          }
        } else {
          if (self.type == "payement") {
            self.executeajax(
              event,
              {
                filename: self.file_name,
                file_data: self.file_array
              },
              "put_csv_flux_payement"
            );
          } else if (self.type == "expedition") {
            self.executeajax(
              event,
              {
                filename: self.file_name,
                file_data: self.file_array
              },
              "put_csv_flux_amazon_complet"
            );
          }
        }
      });
    },
    /**
     * Permet de calculer la valeur ht de la colonne si elle est fournit en TTC.
     */
    async formatFieldItemPrice() {
      var self = this;
      return new Promise(resolve => {
        var column_item_price = "item-price";
        var column_item_tax = "item-tax";
        var index_item_price = self.header_file.indexOf(column_item_price);
        var index_item_tax = self.header_file.indexOf(column_item_tax);
        for (const j in self.file_array) {
          if (
            j > 0 &&
            self.file_array[j][index_item_price] &&
            self.file_array[j][index_item_tax]
          ) {
            /*
            console.log(
              "formatFieldItemPrice debut ",
              self.file_array[j][index_item_price],
              " :: ",
              self.file_array[j][index_item_tax]
            );
            /**/
            self.file_array[j][index_item_price] =
              parseFloat(self.file_array[j][index_item_price]) -
              parseFloat(self.file_array[j][index_item_tax]);
            /*
            console.log(
              "formatFieldItemPrice fin ",
              self.file_array[j][index_item_price],
              " :: ",
              self.file_array[j][index_item_tax]
            );
            /**/
          }
        }
        resolve(true);
      });
    },
    /**
     * Description à ajouter.
     * parcourt les données et concervent uniquement les lignesrespectants la condiftion.
     */
    async filterDatas(column = "fulfillment-channel", value = "Merchant") {
      var self = this;
      return new Promise(resolve => {
        var newDatas = [];
        var index = self.header_file.indexOf(column);
        if (index !== -1) {
          for (const i in self.file_array) {
            if (i == 0) {
              newDatas.push(self.file_array[i]);
            } else if (self.file_array[i][index] == value) {
              newDatas.push(self.file_array[i]);
            }
          }
        }
        resolve(newDatas);
      });
    },
    /**
     * Ajoute une colonne dans le fichiers de données.
     * si value nest pas données les données dans la colonne de reference serront utilisées.
     */
    async addColumnsDatas(reference, new_column) {
      var self = this;
      if (self.header_file.includes(reference)) {
        for (const i in self.header_file) {
          if (self.header_file[i] == reference) {
            self.header_file.push(new_column);
            for (const j in self.file_array) {
              if (j > 0) {
                var val = self.file_array[j][i];
                self.file_array[j].push(val);
              }
            }
          }
        }
      }
    },
    async addColumns(new_column, value = 0) {
      var self = this;
      var index = self.header_file.indexOf(new_column);
      if (index === -1) {
        self.header_file.push(new_column);
        for (const j in self.file_array) {
          if (j > 0) {
            self.file_array[j].push(value);
          }
        }
      }
    },
    /**
     * Formatte les cellules qui sont vide dans le format definit
     */
    async formatCelluleDecimal(columns) {
      var self = this;
      for (const k in columns) {
        var index = self.header_file.indexOf(columns[k]);
        for (const j in self.file_array) {
          if (
            self.file_array[j][index] == "" ||
            self.file_array[j][index] === null
          ) {
            self.file_array[j][index] = parseFloat(0);
          }
        }
      }
    },
    async RenameColumnsDatas(reference, new_column) {
      var self = this;
      self.file_array;
      self.header_file;
      if (self.header_file.includes(reference)) {
        for (const i in self.header_file) {
          if (self.header_file[i] == reference) {
            self.header_file[i] = new_column;
          }
        }
      }
    },
    checkErrorInfieldColumn(headers) {
      var self = this;
      return new Promise(resole => {
        var error = false;
        var error_fields = "";
        var success_fields = "";
        $.each(headers, function(i, val) {
          if (self.header_file.indexOf(val) < 0) {
            /*
            console.log(
              "find : ",
              val,
              "; reponse : ",
              self.header_file.indexOf(val)
            );
            /**/
            error_fields += val + ", ";
            error = true;
          } else {
            // console.log('find : ', val, '; reponse : ',
            // self.header_file.indexOf(val));
            success_fields += val + ", ";
          }
        });
        resole({
          error: error,
          error_fields: error_fields,
          success_fields: success_fields
        });
      });
    },
    headersFile: function() {
      if (this.type == "payement") {
        return [
          "settlement-id",
          "settlement-start-date",
          "settlement-end-date",
          "deposit-date",
          "total-amount",
          "currency",
          "transaction-type",
          "order-id",
          "merchant-order-id",
          "adjustment-id",
          "shipment-id",
          "marketplace-name",
          "shipment-fee-type",
          "shipment-fee-amount",
          "order-fee-type",
          "order-fee-amount",
          "fulfillment-id",
          "posted-date",
          "order-item-code",
          "merchant-order-item-id",
          "merchant-adjustment-item-id",
          "sku",
          "quantity-purchased",
          "price-type",
          "price-amount",
          "item-related-fee-type",
          "item-related-fee-amount",
          "misc-fee-amount",
          "other-fee-amount",
          "other-fee-reason-description",
          "promotion-id",
          "promotion-type",
          "promotion-amount",
          "direct-payment-type",
          "direct-payment-amount",
          "other-amount"
        ];
      } else if (this.type == "expedition") {
        return [
          "amazon-order-id",
          "merchant-order-id",
          "shipment-id",
          "shipment-item-id",
          "amazon-order-item-id",
          "merchant-order-item-id",
          "purchase-date",
          "payments-date",
          "shipment-date",
          "reporting-date",
          "buyer-email",
          "buyer-name",
          "buyer-phone-number",
          "sku",
          "product-name",
          "quantity-shipped",
          "currency",
          "item-price",
          "item-tax",
          "shipping-price",
          "shipping-tax",
          "gift-wrap-price",
          "gift-wrap-tax",
          "ship-service-level",
          "recipient-name",
          "ship-address-1",
          "ship-address-2",
          "ship-address-3",
          "ship-city",
          "ship-state",
          "ship-postal-code",
          "ship-country",
          "ship-phone-number",
          "bill-address-1",
          "bill-address-2",
          "bill-address-3",
          "bill-city",
          "bill-state",
          "bill-postal-code",
          "bill-country",
          "item-promotion-discount",
          "ship-promotion-discount",
          "carrier",
          "tracking-number",
          "estimated-arrival-date",
          "fulfillment-center-id",
          "fulfillment-channel",
          "sales-channel"
        ];
      } else {
        return [];
      }
    },
    /**
     * Champs utilisée par le nouveau model de fichier.
     */
    headerNewFile() {
      return [
        "amazon-order-id",
        "merchant-order-id",
        "purchase-date",
        "last-updated-date",
        "order-status",
        "fulfillment-channel",
        "sales-channel",
        "order-channel",
        "url",
        "ship-service-level",
        "product-name",
        "sku",
        "asin",
        "item-status",
        "quantity",
        "currency",
        "item-price",
        "item-tax",
        "shipping-price",
        "shipping-tax",
        "gift-wrap-price",
        "gift-wrap-tax",
        "item-promotion-discount",
        "ship-promotion-discount",
        "ship-city",
        "ship-state",
        "ship-postal-code",
        "ship-country",
        "promotion-ids",
        "is-business-order",
        "purchase-order-number",
        "price-designation",
        "is-sold-by-ab "
      ];
    },
    ev_alert_close() {
      this.show_alert = false;
    },
    FormatTestesMessages() {
      var txt = "";
      for (const i in this.textes) {
        txt += this.textes[i];
      }
      return txt;
    }
  },
  computed: {
    textes_messages: {
      get() {
        if (this.textes) {
          return this.FormatTestesMessages();
        }
        return "";
      }
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/ImportDatas.vue
-->
