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
    public device;

    public filters = [
        // verbatim_mouse:
        {
            vendorId: 0x0,
            productId: 0x538
        },
        // samsung_core_2:
        {
            vendorId: 0x4e8,
            productId: 0x6860
        },
        // philips_gogear:
        {
            vendorId: 0x471,
            productId: 0x2131
        }
    ];

    public async requestDevice(): Promise<any> {
        let device;
        return new Promise(async (resolve, reject) => {
            try {
                device = await navigator.usb.requestDevice({
                    filters: [
                        this.filters
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
        // this.requestDevice().then(
        //     success => {
        //         console.log('success ---------->', success);
        //         success.open();
        //     },
        //     reject => {
        //         console.warn('Error: ', reject);
        //     }
        // );

        // Other approach (removing all other code)
        navigator.usb.requestDevice({filters: [
            this.filters
        ]})
        .then(selected_device => {
            this.device = selected_device;
            return this.device.open();
        })
        .then(() => this.device.selectConfiguration(1)) // Select configuration #1 for the device.
        .then(() => console.log(this.device))
        // .then(() => this.device.claimInterface(2)) // Request exclusive control over interface #2.
    }
}
