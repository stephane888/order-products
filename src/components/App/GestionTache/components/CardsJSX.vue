<script>
import CardSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/Card.vue";

export default {
  name: "CardsJSX",
  render: function(createElement) {
    var self = this;
    var results = [];

    var loopR = function(datas, results_array = []) {
      for (const i in datas) {
        if (datas[i].cards && datas[i].cards.length) {
          var cards = loopR(datas[i].cards);
          results_array.push(
            createElement(
              CardSlot,
              {
                props: {
                  project: datas[i],
                  class_card_body: self.getAttributeInConfigs(
                    datas[i].testconfigs,
                    "class_card_body",
                    "row"
                  ),
                  class_card: self.getAttributeInConfigs(
                    datas[i].testconfigs,
                    "class_card",
                    "col-sm-12"
                  ),
                  container_class_card: self.getAttributeInConfigs(
                    datas[i].testconfigs,
                    "container_class_card",
                    "bg-light"
                  )
                },
                on: {
                  ev_select_project: function(project) {
                    self.$emit("ev_select_project", project);
                  },
                  ev_add_tache: function(datas) {
                    self.$emit("ev_add_tache", datas);
                  },
                  ev_edit: function(datas) {
                    self.$emit("ev_edit", datas);
                  },
                  ev_delete_project: function(datas) {
                    self.$emit("ev_delete_project", datas);
                  },
                  ev_edit_style: function(datas) {
                    self.$emit("ev_edit_style", datas);
                  },
                  ev_edit_ressources: function(datas) {
                    self.$emit("ev_edit_ressources", datas);
                  },
                  ev_edit_timer: function(datas) {
                    self.$emit("ev_edit_timer", datas);
                  }
                }
              },
              cards
            )
          );
        } else {
          results_array.push(
            createElement(CardSlot, {
              props: {
                project: datas[i],
                class_card_body: self.getAttributeInConfigs(
                  datas[i].testconfigs,
                  "class_card_body",
                  "row"
                ),
                class_card: self.getAttributeInConfigs(
                  datas[i].testconfigs,
                  "class_card",
                  "col-sm-12"
                ),
                container_class_card: self.getAttributeInConfigs(
                  datas[i].testconfigs,
                  "container_class_card",
                  "bg-light"
                )
              },
              on: {
                ev_select_project: function(project) {
                  self.$emit("ev_select_project", project);
                },
                ev_add_tache: function(datas) {
                  self.$emit("ev_add_tache", datas);
                },
                ev_edit: function(datas) {
                  self.$emit("ev_edit", datas);
                },
                ev_delete_project: function(datas) {
                  self.$emit("ev_delete_project", datas);
                },
                ev_edit_style: function(datas) {
                  self.$emit("ev_edit_style", datas);
                },
                ev_edit_ressources: function(datas) {
                  self.$emit("ev_edit_ressources", datas);
                },
                ev_edit_timer: function(datas) {
                  self.$emit("ev_edit_timer", datas);
                }
              }
            })
          );
        }
      }
      return results_array;
    };
    results = loopR(this.projects, results);

    return createElement("div", results);
  },
  props: {
    projects: {
      type: [Array, Object]
    }
  },
  data: function() {
    return {
      result: []
    };
  },
  mounted() {
    //console.log("mounted TestRenduJSX ", this.projects);
  },
  methods: {
    getAttributeInConfigs(configs, key, defaultValue = "") {
      if (configs && configs !== "") {
        configs = JSON.parse(configs);
        if (configs[key]) {
          return configs[key];
        } else {
          return defaultValue;
        }
      } else {
        return defaultValue;
      }
    }
  }
};
</script>

<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/GestionTache/components/CardsJSX.vue
-->
