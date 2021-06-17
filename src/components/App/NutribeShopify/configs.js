/**
 * Axios doit etre definie;
 */
import { AjaxToastBootStrap as Ajax } from "wbuutilities";
const configs = {
  databaseConfig: "shopify-app",
  themeId: 13333299266,
  Post: function(datas, token, notification = false) {
    return new Promise(resolv => {
      var configs = {
        headers: {
          "X-CSRF-Token": token
        }
      };
      Ajax.axiosInstance.defaults.timeout = 30000;
      Ajax.post("/shopify/requets.php", datas, configs, notification)
        .then(reponse => {
          resolv({ status: true, data: reponse.data, reponse: reponse });
        })
        .catch(error => {
          resolv({ status: false, error: error });
        });
    });
  },
  GetProducts: function() {
    var datas = {
      databaseConfig: this.databaseConfig
    };
    return new Promise(resolv => {
      this.Post(datas, "shopify_load_products").then(reponse => {
        if (reponse.status) {
          if (
            reponse.data.return &&
            reponse.data.return.products &&
            reponse.data.return.products.products
          ) {
            resolv(reponse.data.return.products.products);
          } else {
            // display alert error messages.
            resolv([]);
          }
        } else {
          // display alert error messages.
          resolv([]);
        }
      });
    });
  },
  SaveImage: function(formData) {
    return new Promise(resolv => {
      const datas = {
        databaseConfig: this.databaseConfig,
        fileBase64: formData.base64,
        name: formData.name,
        themeId: this.themeId
      };
      this.Post(datas, "saveImage", true).then(reponse => {
        if (reponse.status) {
          if (
            reponse.data.return &&
            reponse.data.return.saveImage &&
            reponse.data.return.saveImage &&
            reponse.data.return.saveImage.asset
          ) {
            resolv(reponse.data.return.saveImage.asset);
            return;
          }
        }
        resolv();
      });
    });
  },
  DeleteFile: function(key) {
    return new Promise(resolv => {
      const datas = {
        databaseConfig: this.databaseConfig,
        key: key,
        themeId: this.themeId
      };
      this.Post(datas, "DeleteImage", true).then(reponse => {
        if (reponse.status) {
          resolv(true);
          return;
        }
        resolv(false);
      });
    });
  },
  GetProductMetafield: function(productid) {
    const datas = {
      databaseConfig: this.databaseConfig,
      productid: productid
    };
    return new Promise(resolv => {
      this.Post(datas, "shopify_load_product_metafield").then(reponse => {
        if (reponse.status) {
          if (
            reponse.data.return &&
            reponse.data.return["product-metafield"] &&
            reponse.data.return["product-metafield"].metafields
          ) {
            resolv(reponse.data.return["product-metafield"].metafields);
          } else {
            // display alert error messages.
            resolv([]);
          }
        } else {
          // display alert error messages.
          resolv([]);
        }
      });
    });
  },
  SaveMetaFieldProduct: function(
    value,
    key,
    productid,
    type_metafield = "json_string"
  ) {
    return this.SaveMetaField("product", key, type_metafield, productid, value);
  },
  SaveMetaField: function(
    type,
    key,
    type_metafield,
    id_entity,
    value,
    id_parent = null
  ) {
    const datas = {
      databaseConfig: this.databaseConfig,
      metafields: {
        type_metafield: type_metafield,
        id_entity: id_entity,
        type: type,
        key: key,
        value: value,
        id_parent: id_parent
      }
    };
    return new Promise(resolv => {
      this.Post(datas, "save_metafields", true).then(reponse => {
        if (reponse.status) {
          if (
            reponse.data.return &&
            reponse.data.return["product-metafield"] &&
            reponse.data.return["product-metafield"].metafields
          ) {
            resolv(reponse.data.return["product-metafield"].metafields);
          } else {
            // display alert error messages.
            resolv([]);
          }
        } else {
          // display alert error messages.
          resolv([]);
        }
      });
    });
  }
};

export default configs;

///siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/configs.js
