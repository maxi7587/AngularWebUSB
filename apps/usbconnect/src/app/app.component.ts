import { Component } from '@angular/core';

declare global {
    interface Navigator {
        usb: {
            requestDevice(args): any;
            getDevices(): any[];
        }
    }
}

@Component({
    selector: 'webusb-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public title = 'webusb';

    public filters = {
        verbatim_mouse: {
                vendorId: 0x0,
                productId: 0x538
        },
        samsung_core_2: {
            vendorId: 0x4e8,
            productId: 0x6860
        }
    }

    public async requestDevice(): Promise<any> {
        let device;
        return new Promise(async (resolve, reject) => {
            try {
                device = await navigator.usb.requestDevice({
                    filters: [
                        this.filters.verbatim_mouse,
                        this.filters.samsung_core_2
                    ]
                });
            } catch (err) {
                console.warn('Error: No device was selected', err)
            }

            if (device === undefined) {
                // Add device to the UI.
                reject('Failed to request device');
            } else {
                resolve(device);
            }
        });
    }

    public connectToDevice(): void {
        this.requestDevice().then(
            success => {
                console.log('success ---------->', success);
                success.open()
            },
            reject => {
                console.warn('Error: ', reject);
            }
        );
    }
}
