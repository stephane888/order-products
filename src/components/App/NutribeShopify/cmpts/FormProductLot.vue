<template>
  <div>
    <!-- On construit un formulaire basique -->
    <builder-forms
      :text_save="'++ ' + button_title"
      :is_running="is_running"
      :show_submit="false"
      :disable_submit_keyenter="true"
      ref="builderforms"
    >
      <template v-slot:form_top>
        <div class="mb-4 row" v-if="show_field">
          <div class="col-md-6">
            <inputselectnew
              :label="'Selectionner le produit'"
              :options="sku_options"
              :input="sku_product"
              :id_html="index + 'sku_product'"
              :rules="'required'"
              :mode="'passive'"
            ></inputselectnew>
          </div>
          <div class="col-md-6">
            <inputtextnew
              :label="'Numero'"
              :input="numero"
              :id_html="index + 'numero'"
              :rules="'required'"
              :mode="'passive'"
            ></inputtextnew>
          </div>

          <!--  -->
          <div class="col-md-6">
            <input-datepicker-v2
              :label="'Date de fabrication'"
              :input="fabdate"
              :id_html="index + 'fabdate'"
            ></input-datepicker-v2>
          </div>
          <div class="col-md-6">
            <input-datepicker-v2
              :label="'dluo'"
              :input="dluo"
              :id_html="index + 'dluo'"
            ></input-datepicker-v2>
          </div>
          <!--  -->
          <div class="col-md-6">
            <inputnumber
              :label="'Unites'"
              :input="unites"
              :id_html="index + 'unites'"
              :rules="'required'"
              :mode="'passive'"
            ></inputnumber>
          </div>
          <div class="col-md-6" v-if="action !== 'add'">
            <inputnumber
              :label="'Disponibles'"
              :input="udisp"
              :id_html="index + 'udisp'"
            ></inputnumber>
          </div>
          <div class="col-md-6" v-if="action !== 'add'">
            <inputselectnew
              :label="'Selectionner le prochain lot'"
              :input="prochain"
              :id_html="index + 'prochain'"
              :options="listes_prochain_lots"
            ></inputselectnew>
          </div>
        </div>

        <div class="d-flex justify-content-end ">
          <button
            class="btn btn-outline-success btn-sm mr-4"
            @click="save_data"
          >
            <span v-html="button_title"></span>
            <i
              :class="[
                is_running
                  ? 'fas fa-sync fa-spin'
                  : 'fas fa-sync d-none fa-spin'
              ]"
            ></i>
          </button>
        </div>
      </template>
    </builder-forms>
  </div>
</template>
<script>
import InputText from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputText.vue";
import InputSelect from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputSelect.vue";
import InputNumber from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Fomrs/Elements/InputNumber.vue";
/**
 * Le format d'entre (2020-03-27 ou 27-03-2020 ) le format de retour doit
 * etre YY-MM-DD (2020-03-27)
 */
async function getDateMySql(val) {
  var dataiso = "";
  if (val) {
    val = val.split("-");
    if (parseInt(val[2]) > 2000) {
      if (val[2]) {
        dataiso += val[2].toString().padStart(2, "0");
      }
      if (val[1]) {
        dataiso += "-" + val[1].toString().padStart(2, "0");
      }
      if (val[0]) {
        dataiso += "-" + val[0].toString().padStart(2, "0");
      }
    } else {
      if (val[0]) {
        dataiso += val[0].toString().padStart(2, "0");
      }
      if (val[1]) {
        dataiso += "-" + val[1].toString().padStart(2, "0");
      }
      if (val[2]) {
        dataiso += "-" + val[2].toString().padStart(2, "0");
      }
    }
    return dataiso;
  }
}
export default {
  props: {
    formdatas: {
      type: [Object]
    },
    sku_options: {
      type: [Object, Array]
    },
    action: {
      type: [String],
      default: "add"
    },
    button_title: {
      type: [String],
      default: "AJOUTER"
    },
    is_running: {
      type: [Boolean],
      default: false
    },
    index: {
      type: [String],
      default: "in1-"
    },
    values_forms: {
      type: [Object]
    },
    listes_prochain_lots: {
      type: [Object]
    }
  },
  data: function() {
    return {
      numero: {
        value: ""
      },
      sku_product: {
        value: ""
      },
      fabdate: {
        value: ""
      },
      dluo: {
        value: ""
      },
      unites: {
        value: ""
      },
      udisp: {
        value: ""
      },
      prochain: {
        value: ""
      },
      event_clik: "",
      show_field: true
    };
  },
  components: {
    inputtextnew: InputText,
    inputselectnew: InputSelect,
    inputnumber: InputNumber
  },
  watch: {
    values_forms: {
      handler: function(newValue) {
        if (newValue && newValue.row) {
          this.values = newValue.row;
          if (this.values_forms.table === "produits") {
            this.show_field = false;
          } else {
            this.show_field = true;
          }
          this.setValues();
        }
      },
      deep: true
    }
  },

  methods: {
    emptyField() {
      console.log("emptyField()");
    },
    async save_data(event) {
      //console.log("save_data", event);
      //console.log(this.$refs.builderforms.$refs.validationobserver.validate());
      const status = await this.$refs.builderforms.$refs.validationobserver.validate();
      if (status) {
        this.send_data(event);
      }
    },
    async send_data(event) {
      this.event_clik = event;
      var datas = {};
      var table = await this.getTable();
      var fields = {};
      if (table === "lots") {
        if (this.numero.value === "") {
          alert("Le numero du lot doit etre definit");
          return false;
        }
        fields = {
          numero: this.numero.value,
          produit: this.sku_product.value,
          dluo: await getDateMySql(this.dluo.value),
          fabdate: await getDateMySql(this.fabdate.value),
          unites: this.unites.value,
          udisp: this.udisp.value,
          prochain: this.prochain.value
        };

        if (this.action === "add") {
          fields.udisp = this.unites.value;
          datas = {
            fields: fields,
            table: table
          };
        } else {
          var f1_value = this.values_forms.row.produit;
          var f2_value = this.values_forms.row.numero;

          datas = {
            fields: fields,
            table: table,
            where: {
              f1: {
                value: f1_value,
                column: "produit",
                operator: "="
              },
              f2: {
                value: f2_value,
                column: "numero",
                operator: "="
              }
            }
          };
        }
      } else if (table === "produits") {
        fields = {
          "lot-courant": this.numero.value
        };
        datas = {
          fields: fields,
          table: table,
          where: {
            f1: {
              value: this.sku_product.value,
              column: "sku",
              operator: "="
            }
          }
        };
      }
      this.$emit("ev_save_data", datas);
    },
    setValues() {
      //console.log(" this.values_forms : ", this.values_forms);
      if (this.values) {
        if (this.values.numero) {
          this.numero.value = this.values.numero;
        }
        if (this.values.produit) {
          this.sku_product.value = this.values.produit;
        }
        if (this.values.dluo) {
          this.dluo.value = this.values.dluo.replace(/\//g, "-");
        }
        if (this.values.fabdate) {
          this.fabdate.value = this.values.fabdate.replace(/\//g, "-");
        }
        if (this.values.unites) {
          this.unites.value = this.values.unites;
        }
        if (this.values.udisp) {
          this.udisp.value = this.values.udisp;
        }
        if (this.values.prochain) {
          this.prochain.value = this.values.prochain;
        }
      }
    },
    async getTable() {
      var table = "lots";
      if (this.values_forms && this.values_forms.table) {
        table = this.values_forms.table;
      }
      return table;
    }
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/FormProductLot.vue
-->
