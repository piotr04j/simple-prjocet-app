namespace App {
    export const autobinding = (_: any, _2: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        const adjustedDescriptor: PropertyDescriptor = {
            configurable: true,
            get(): any {
                const boundFn = originalMethod.bind(this)

                return boundFn
            }
        }

        return adjustedDescriptor
    }
}
