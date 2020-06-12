<template>
  <div id="addnewkol" class="popup open">
    <div>
      <div class="form">
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item class="url-wrapper">
            <label>URL link</label>
            <a-row :gutter="23" v-for="item in urlList">
              <a-col :span="24">
                <a-row :gutter="24">
                  <a-col :span="18">
                    <a-input v-model="item.url" />
                  </a-col>
                  <a-col :span="2" class="action-icon">
                    <div class="thumbnail-social" :id="item.platformtitle"></div>
                  </a-col>
                  <a-col :span="2" class="action-icon">
                    <i
                      class="fa fa-trash-o dynamic-delete-button"
                      @click="() => remove(k)"
                      :disabled="form.getFieldValue('keys').length === 1"
                    ></i>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a @click="addItem" class="bt-addurl">
              <a-icon type="plus" />Add other URL link
            </a>
            <br />
            {{urlList}}
          </a-form-item>

          <!-- 
          <a-form-item
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
            :required="false"
            class="url-wrapper"
          >
            <a-row class="url-row" :gutter="24">
              <a-col :span="3">
                <div class="thumbnail-url">
                  <div></div>
                </div>
              </a-col>
              <a-col :span="21">
                <div class="label">URL link</div>
                <a-row :gutter="24">
                  <a-col :span="18">
                    <a-input
                      v-decorator="[
                      `names[${k}]`,
                      {validateTrigger: ['change', 'blur'],
                       rules: [
                       {
                         required: true,
                         whitespace: true,
                         message: 'Please input url or delete this field.',
                         },
                          ],
                        },
                      ]"
                      @keypress="handlerUrl"
                    />
                  </a-col>
                  <a-col :span="3" class="action-icon">
                    <div class="thumbnail-social" :id="urldomain"></div>
                  </a-col>
                  <a-col :span="3" class="action-icon">
                    <i
                      class="fa fa-trash-o dynamic-delete-button"
                      @click="() => remove(k)"
                      :disabled="form.getFieldValue('keys').length === 1"
                    ></i>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form-item>
          <a @click="addUrl">
            <a-icon type="plus" />Add other URL link
          </a>
          <br />
          <br />-->
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
let id = 0;
export default {
  data() {
    return {
      groupCode: [],
      urldomain: "facebook",
      urlList: [
        {
          url: "",
          platformid: "",
          platformtitle: ""
        }
      ]
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  methods: {
    addItem() {
      this.items.push({
        url: ""
      });
    },
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    },
    addUrl() {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");

      const nextKeys = keys.concat(id++);
      console.log(nextKeys);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handlerUrl(e) {
      // console.log(e);
    }
  },
  mounted() {
    this.addUrl();
  }
};
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.anticon-plus {
  font-size: 14px;
  background: #bf1e2e;
  border-radius: 10px;
  color: #fff;
  padding: 2px;
  margin-right: 0.5em;
}
</style>