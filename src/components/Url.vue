<template>
  <div>
    <div class="wrap-url">
      <a-row :gutter="24">
        <a-col :span="4">
          <div class="thumbnail-url">
            <div></div>
          </div>
        </a-col>
        <a-col :span="20">
          <label>URL Link</label>
          <a-row :gutter="24">
            <a-col :span="17">
              <a-input
                :id="id"
                :type="type"
                :placeholder="placeholder"
                :value="value"
                @input="onHandlerKeyup"
                @focus="onHandlerFocus"
              />
            </a-col>
            <a-col :span="7">
              <div class="thumbnail-social"></div>
              <i class="fa fa-trash-o"></i>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>

    <div class="error-message">{{errorMessage}}</div>
  </div>
</template>

<script>
export default {
  props: {
    className: String,
    id: "",
    type: String,
    placeholder: String,
    limit: String,
    errorMessage: String,
    dataID: String,
    handleKeypress: Function,
    handleKeyup: Function,
    handleFocus: Function,
    value: String
  },
  methods: {
    onHandlerKeypress(event) {
      this.$emit("handleKeypress", event);
    },
    onHandlerKeyup(event) {
      this.$emit("input", event.target.value);
      this.$emit("handleKeyup", event);
    },
    onHandlerFocus(event) {
      this.$emit("handleFocus", event.target.id);
    }
  }
};
</script>
