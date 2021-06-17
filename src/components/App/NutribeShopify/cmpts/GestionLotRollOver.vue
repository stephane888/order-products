<template lang="html">
  <ul class="hover-block">
    <li v-for="(product, index) in current_products" :key="index" class="item">
      <div class="d-flex align-content-center align-items-center">
        <span class="elment badge button-action" v-html="product.udisp"></span>
        <span class="elment title-lot"> {{ product.numero }} </span>
      </div>
      <div
        class="text-center content-img"
        v-if="current_products.length > getNextIndex(index)"
      >
        <img
          v-if="product.prochain"
          class="image-link img-fluid"
          :src="url_base + '/images/link-160.png'"
        />
        <img
          v-if="!product.prochain"
          class="image-link img-fluid"
          :src="url_base + '/images/times.svg'"
        />
      </div>
    </li>
  </ul>
</template>

<script>
//import configApp from "../configs/Config.js";
//import magentoSynchroListSites from "./ListSites.vue";
export default {
  name: "gestionLotRollOver",
  props: {
    /**
     * le tableau contenant les produits.
     */
    productsBlocs: {
      type: Array,
      required: true
    },
    /**
     * l'id du produit.
     */
    product: {
      type: String,
      required: true
    }
  },
  components: {
    //
  },
  data() {
    return {
      url_base: window.wbu_root
    };
  },
  mounted() {
    //
  },
  watch: {
    //
  },
  computed: {
    /**
     * On recupere le nombre de produit.
     */
    current_products: {
      get() {
        var filter_product = [];
        this.productsBlocs.forEach(item => {
          if (item.produit == "MCTPURE250" && item.produit === this.product) {
            console.log("Lot : ", item["lot-courant"]);
            console.log("productsBlocs : ", this.productsBlocs);
          }

          if (item.udisp > 0 && item.produit === this.product) {
            filter_product = item.lots;
          }
        });
        return filter_product;
      }
    }
  },
  methods: {
    getNextIndex(i) {
      return parseInt(i) + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.hover-block {
  padding: 5px 5px 20px 5px;
  position: absolute;
  background: #fff;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  list-style: none;
  margin: 0;
  margin-left: 45px;
  margin-right: 45px;
  margin-top: 10px;
  display: none;
  .item {
    margin-bottom: 0;
    text-align: center;

    .elment {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
    .content-img {
      margin-bottom: 0;
      position: relative;
      height: 12px;
      .image-link {
        position: absolute;
        top: -6px;
        width: 20px;
      }
    }
  }
}
</style>

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
