<!--
//il faut ajouter : https://cdn.jsdelivr.net/accounting.js/0.3.2/accounting.js
et le filtre  :
Vue.filter('currency', function(money) {
		return accounting.formatMoney(money, {
			symbol: "",
			thousand: ".",
			decimal: ",",
		})
	});
-->
<template>
  <div v-if="formated_datas && formated_datas != ''">
    {{ formated_datas | currency }}
  </div>
</template>

<script>
export default {
  name: "FormatNumber",
  props: {
    datas: {
      type: [String, Object, Number, Array],
    },
  },
  mounted() {
    //console.log("Chargement du composant de cellule: FormatNumber.vue");
  },
  computed: {
    formated_datas: {
      get() {
        return this.datas;
      },
    },
  },
};
</script>
