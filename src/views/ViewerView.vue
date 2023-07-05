<template>
    <div>
        <Viewer ref="viewer" height="500px" />
    </div>
</template>

<script>
import { Viewer } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor style

export default {
    components: {
        Viewer,
    },
    methods: {
        setContent(content) {
            this.$refs.viewer.invoke('setHTML', content)
        },
    },
}
</script>