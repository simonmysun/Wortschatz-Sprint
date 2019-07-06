<template>
<div class="notification-container">
  <ul>
    <transition-group name="list" tag="p">
      <Alert :type="item.type" v-for="item in notifications" :key="item.key" class="list-item">
        {{ item.title }}
        <template slot="desc">{{ item.description }}</template>
      </Alert>
    </transition-group>
  </ul>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'NotificationArea',
    computed: mapState({
        notifications: state => state.notifications.notifications
    }),
    mounted() {
        for(let i = this.notifications.length - 1; i >= 0; i -= 1) {
            setTimeout(
                ((scope, id) => (
                    () => scope.$store.dispatch('notifications/removeNotification', scope.notifications[id].key)
                ))(this, i), this.notifications[i].timeout);
        }
    }
};
</script>

<style scoped>
.notification-container {
    position: fixed;
    left: 10px;
    bottom: 10px;
    width: 300px;
    pointer-events: none;
}

.list-item {
    transition: all 1s;
    display: block;
    margin-right: 10px;
    z-index: 9999;
}
.list-enter {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(-150px);
}
.list-leave-active {
    position: absolute;
}
</style>
