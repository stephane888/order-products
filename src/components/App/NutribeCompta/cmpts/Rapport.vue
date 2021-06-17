<template>
  <div class="card card-light mt-3 mb-4">
    <h5 class="card-header">Rapport de vente par SKU</h5>
    <div class="card-body">
      <div class="row">
        <div class="col-sm-6">
          <h5>Shopify</h5>
          <table class="table table-bordered">
            <tr
              v-for="(vente_sku, index) in listes_vente_sku_shopify"
              :key="index"
            >
              <td v-html="render_vente_sku(vente_sku.sku)"></td>
              <td class="number" v-html="vente_sku.qte"></td>
            </tr>
          </table>
        </div>
        <div class="col-sm-6">
          <h5>Amazon</h5>
          <table class="table table-bordered">
            <tr
              v-for="(vente_sku, index) in listes_vente_sku_amazon"
              :key="index"
            >
              <td v-html="render_vente_sku(vente_sku.sku)"></td>
              <td class="number" v-html="vente_sku.qte"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rapport",
  props: {
    listes_vente_sku_amazon: {
      type: Array,
    },
    listes_vente_sku_shopify: {
      type: Array,
    },
  },
  data() {
    return {
      sku_img_products: {
        MCTCRE1X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREM1X300-packshot_x100.jpg",
        MCTCRE2X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/packshot-x2_x300.jpg?v=1589748355",
        MCTCRE3X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/packshot-x3_x300.jpg?v=1589748355",
        "H-01001":
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226466_x100.jpg",
        "H-01002":
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226497_x100.jpg",
        "H-01003":
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226503_x100.jpg",
        MCTVIT1X500:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226473_860bccb0-9de4-4365-977b-bd2b6deb19e9_x300.jpg?v=1581165833",
        MCTPACKCET01:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/Nutribe-pack_cetose_x100.jpg",
        MCTPACKCETO1:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/Nutribe-pack_cetose_x100.jpg",
        MCTCREV1X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV1X300-packshot_x100.jpg",
        MCTCREV2X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV2X300-packshot_x100.jpg",
        MCTCREV3X300:
          "https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV3X300-packshot_x100.jpg",
      },
    };
  },
  methods: {
    render_vente_sku: function (sku) {
      sku = this.sku_img_products[sku]
        ? '<span class="img-content"><img src="' +
          this.sku_img_products[sku] +
          '" class="image-small" />  </span>' +
          sku
        : sku;
      return sku;
    },
  },
};
</script>

<style lang="scss">
.table .img-content {
  min-width: 50px;
  display: inline-block;
  text-align: center;
  margin-right: 10px;
}
</style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeCompta/cmpts/Rapport.vue
-->
