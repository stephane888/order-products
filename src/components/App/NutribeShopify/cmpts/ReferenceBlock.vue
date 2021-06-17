<template>
  <div>
    <div :id="id_html">
      <div v-for="(block, index) in blocks" class="drap-drop-box" :key="index">
        <div class="d-flex justify-content-center align-items-center">
          <div class="identifiant text-center py-2">
            {{ index + 1 }}
            <i class="fas fa-arrows-alt fa-2x text-warning"></i>
          </div>
          <div class="w-100">
            <div class="form-group">
              <label>Libellé</label>
              <input
                class=" form-control"
                type="text"
                v-model="block.art_ref_titre"
              />
            </div>
            <div class="form-group">
              <label>Url</label>
              <input
                class=" form-control"
                type="text"
                v-model="block.art_ref_description"
              />
            </div>
            <span
              class="btn btn-outline-danger btn-sm remove-block"
              @click="remove_block(index)"
              ><i class="fas fa-trash-alt"></i
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <span
        class="btn btn-outline-success btn-sm"
        @click="save_reference"
        v-if="show_save"
      >
        Enregistrer <i v-if="form_running" class="fas fa-sync fa-spin "> </i>
      </span>
      <span
        class="btn btn-outline-success btn-sm float-right "
        @click="add_new_block"
        v-if="show_add"
      >
        Ajouter un bloc
      </span>
    </div>
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
function set_defautl_model(id) {
  return {
    id: id,
    art_ref_titre: "",
    art_ref_description: ""
  };
}
export default {
  name: "ReferenceBlock",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "blocks-reference"
    }
  },
  data() {
    return {
      /**
       * Contient les  blocks de references.
       */
      blocks: [],
      show_add: true,
      show_save: true,
      metafield_name: "ref_blocks"
      /**
       * id blocks
       */
    };
  },
  mounted() {
    //console.log("chargement du module ReferenceBlock");
    this.PrepareBuildBloc();
  },
  methods: {
    PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc() {
      this.blocks = [];
      //alert("");
      var nombreMetafield = this.metafields.length;
      if (nombreMetafield) {
        for (const i in this.metafields) {
          var metafield = this.metafields[i];
          if (metafield.key === this.metafield_name) {
            var val = JSON.parse(metafield.value);
            //console.log("block datas, ", metafield.value, val);
            if (metafield.value_type === "json_string") {
              this.blocks = val;
            } else {
              /**
               * Le type string etait utiliser au debut, actuelement on convertie en  json_string.
               */
              // on verifie si  c'est un object, on convertie en tableau.
              if (val instanceof Array) {
                this.blocks = this.deCodeData(val);
              } else {
                for (const j in val) {
                  this.blocks.push(this.deCodeData(val[j]));
                }
              }
            }
          }
          /**
           *  En fin de boucle :
           *  - On ajoute la valeur par defaut.
           *  - On ajoute le trie.
           */
          var ii = parseInt(i) + 1;
          if (nombreMetafield === ii) {
            if (!this.blocks.length) {
              this.blocks.push(set_defautl_model(this.article.id));
            }
            this.add_sortable();
          }
        }
      } else {
        this.blocks.push(set_defautl_model(this.article.id));
      }
    },
    deCodeData(data) {
      for (const i in data) {
        data[i] = decodeURIComponent(data[i]);
      }
      return data;
    },
    enCodeData(data) {
      for (const i in data) {
        data[i] = encodeURIComponent(data[i]);
      }
      return data;
    },
    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.blocks,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    add_new_block() {
      this.blocks.push({
        id: this.article.id,
        art_ref_titre: "",
        art_ref_description: ""
      });
    },
    remove_block(index) {
      this.blocks.splice(index, 1);
    },
    add_sortable() {
      var self = this;
      var old_index, new_index;
      $("#" + this.id_html).sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //containment: "parent",
        placeholder: "ui-state-highlight",
        //revert: true,
        start: function(event, ui) {
          if (event) {
            console.log("height : ", $(ui.item[0]).height());
            $(" .ui-state-highlight").height($(ui.item[0]).height());
            old_index = $(ui.item[0]).index();
          }
        },
        stop: function(event, ui) {
          if (event) {
            new_index = $(ui.item[0]).index();
            /**
             * Il faut desactiver avant de modofier le tableau.
             */
            $("#" + self.id_html).sortable("cancel");
            self.array_move(self.blocks, old_index, new_index);
            /*
            console.log(
              "old_index : ",
              old_index,
              "\n new_index : ",
              new_index
            );
            /**/
          }
        }
      });
    },
    array_move(arr, old_index, new_index) {
      while (old_index < 0) {
        old_index += arr.length;
      }
      while (new_index < 0) {
        new_index += arr.length;
      }
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  },
  computed: {
    //
  },
  watch: {
    article: {
      handler() {
        //this.PrepareBuildBloc();
      },
      deep: true
    },
    metafields: {
      handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue
-->
