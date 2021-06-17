<template lang="html">
  <div ref="current">
    <div v-show="selectBody === 'add_block'">
      <b-form-group label="Selectionner le modele">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="SelectTemplate"
        ></b-form-select>
      </b-form-group>
      <component
        :is="template_modele"
        :block="DatasImageTitreTexte"
      ></component>
    </div>
    <div v-show="selectBody === 'show_block'">
      <b-table :items="blocks" :fields="fields">
        <!-- Optional default data cell scoped slot -->
        <template #cell(action)="data">
          <pre>
            {{ data }}
          </pre>
        </template>
      </b-table>
      <!--
      <div v-for="(block, i) in blocks" :key="i">
        <component
          :is="checkTemplateExist(block.type)"
          :block="block"
        ></component>
      </div>
      -->
    </div>
  </div>
</template>

<script>
function defaultImageTitreTexte() {
  return {
    title: "",
    short_desc: {
      processed: ""
    },
    image: {
      url: "",
      alt: "",
      title: "",
      filename: ""
    },
    button: {
      link: "",
      texte: "",
      class: ""
    }
  };
}
const templates = {
  "image-titre-texte-7-5": ImageTitreTexte,
  "titre-texte-image-5-7": ImageTitreTexte,
  "image-titre-texte-6-6": ImageTitreTexte,
  "titre-texte-image-6-6": ImageTitreTexte,
  "titreH3-texte-image-hpadding": ImageTitreTexte,
  "titreH3-texte-image-hpadding-inv": ImageTitreTexte,
  "titreH4-texte-image-hpadding-inv": ImageTitreTexte,
  "titreH3-texte-image-hpadding-border": ImageTitreTexte,
  "titreH3-texte-image-hpadding-inv-border": ImageTitreTexte
};

import Configs from "../configs.js";
import ImageTitreTexte from "../../../ModelBlocks/ImageTitreTexte.vue";
export default {
  name: "GestionModelsSection",
  props: {
    entity: {
      type: Object,
      required: true
    },
    typeEntity: {
      type: String,
      required: true,
      validator: function(val) {
        return val === "product" ? true : false;
      }
    }
  },
  components: {
    ...templates
  },
  data() {
    return {
      options: [
        { text: "image-titre-texte-7-5", value: "image-titre-texte-7-5" },
        { text: "titre-texte-image-5-7", value: "titre-texte-image-5-7" },
        { text: "image-titre-texte-6-6", value: "image-titre-texte-6-6" },
        { text: "titre-texte-image-6-6", value: "titre-texte-image-6-6" },
        {
          text: "titreH3-texte-image-hpadding",
          value: "titreH3-texte-image-hpadding"
        },
        {
          text: "titreH3-texte-image-hpadding-inv",
          value: "titreH3-texte-image-hpadding-inv"
        },
        {
          text: "titreH3-texte-image-hpadding-border",
          value: "titreH3-texte-image-hpadding-border"
        },
        {
          text: "titreH3-texte-image-hpadding-inv-border",
          value: "titreH3-texte-image-hpadding-inv-border"
        },
        {
          text: "titreH4-texte-image-hpadding",
          value: "titreH4-texte-image-hpadding"
        },
        {
          text: "titreH4-texte-image-hpadding-inv",
          value: "titreH4-texte-image-hpadding-inv"
        },
        { text: "texte-image-texte", value: "texte-image-texte" },
        { text: "titre-h2", value: "titre-h2" },
        { text: "image-texte-texte", value: "image-texte-texte" },
        { text: "reponse-question", value: "reponse-question" },
        { text: "titre-texte-titre-texte", value: "titre-texte-titre-texte" }
      ],
      selected: "",
      template_modele: "",
      DatasImageTitreTexte: defaultImageTitreTexte(),
      blocks: [],
      selectBody: "show_block",
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "type",
          label: "Type de model"
        },
        {
          key: "action",
          label: "#Action"
        }
      ]
    };
  },
  mounted() {
    this.GetProductMetafield();
  },
  watch: {
    //
  },
  computed: {
    productId() {
      return this.entity.id ? this.entity.id : 0;
    }
  },
  methods: {
    SelectTemplate(value) {
      this.template_modele = value;
    },
    GetProductMetafield() {
      if (this.typeEntity === "product")
        Configs.GetProductMetafield(this.productId).then(reponses => {
          for (const i in reponses) {
            const k = reponses[i];
            if (k.key.indexOf("bloc_tab_") !== -1) {
              this.blocks.push(JSON.parse(k.value));
            }
          }
        });
    },
    checkTemplateExist(value) {
      if (value in templates) {
        return value;
      } else {
        console.log("Template non definit : ", value);
        return "";
      }
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
