<template>
  <div>
    {{ formated_datas }}
  </div>
</template>

<script>
export default {
  name: "OrderProductsIdorder",
  props: {
    datas: {
      type: [String, Object, Number, Array],
    },
    ligne: {
      type: [String, Object, Number, Array],
    },
  },
  mounted() {
    //console.log("Chargement du composant de cellule: OrderProductsIdorder.vue");
  },
  computed: {
    formated_datas: {
      get() {
        if (this.datas !== "Total") {
          if (
            this.ligne &&
            this.ligne.id_shopify &&
            this.ligne.id_shopify !== ""
          ) {
            return this.ligne.id_shopify + " (" + this.datas + ")";
          } else {
            return this.datas;
          }
        } else {
          return "";
        }
      },
    },
  },
};
</script>
<!-- Permet de ne pas afficher une cellule, (donnée vide). -->
<!-- Permet d'afficher le id de la commande et sa reference. -->
<!-- ./src/components/App/NutribeCompta/cmpts/OrderProductsIdorder.vue -->
