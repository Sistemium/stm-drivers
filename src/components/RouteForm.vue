<template lang="pug">

.route-form

  mt-button(
  @click="addCommentClick"
  ) Добавить комментарий

  mt-popup.popup(
  v-model="popupVisible"
  position="right"
  v-if="shipmentRoute"
  )
    nav-header.root-nav(
    left-icon="back"
    :prev="cancelCommentClick"
    ) Комментарий к маршруту

    .form()

      textarea(
      v-model="shipmentRoute.commentText"
      placeholder="Если нужно, то напишите тут пожелания по погрузке"
      rows="4"
      )

      .divider

      mt-button(
      type="primary"
      @click="doneCommentClick"
      ) Готово


</template>
<script>

export default {

  name: 'RouteForm',

  props: {
    shipmentRoute: Object,
  },

  data() {
    return { popupVisible: false };
  },

  methods: {

    addCommentClick() {
      this.popupVisible = true;
    },

    doneCommentClick() {
      this.popupVisible = false;
      this.shipmentRoute.save()
        .finally(this.$loading.show().hide);
    },

    cancelCommentClick() {
      this.shipmentRoute.revert();
      this.popupVisible = false;
    },

  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.route-form > * {
  width: 100%;
}

.comments {
  margin: $margin-top 0;
}

.popup {
  left: 0;
  top: 50%;
  bottom: -50%;
}

.form {
  box-sizing: border-box;
  padding: $margin-right;
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: $margin-top;
  }
}

textarea {
  font-size: 100%;
  border: $list-cell-borders;
  padding: $margin-top;
  border-radius: $border-radius;
}

.root-nav {
  font-size: 90%;
  font-weight: 500;
  background: $gray-background;
}

</style>
