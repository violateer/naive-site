import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

declare module '*.vue' {
    import { defineComponent } from 'vue'
    const Component: ReturnType<typeof defineComponent>
    export default Component
}

declare global {
    interface Window {
        $message: MessageApiInjection;
        $dialog: DialogApiInjection;
    }
}
