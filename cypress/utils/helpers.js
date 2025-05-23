import { defaultHeadersCloud } from '../utils/headers';


export function generateDropOffCode() {
    const dropOffCode = Math.ceil(Math.random() * 9999999999999999);
  
    return dropOffCode < 1000000000000000
      ? dropOffCode + 1000000000000000
      : dropOffCode;
}

export function generatePickUpCode() {
    const pickUpCode = Math.ceil(Math.random() * 9999);
  
    return pickUpCode < 1000 ? pickUpCode + 1000 : pickUpCode;
  }


export function createRent(dropOffCode) {
    const payload = {
      expiryDate: "2050-11-19T15:01:45+00:00",
      date: "2025-12-31",
      labelContent: {
        date: "2025-12-31",
        tracking_code: dropOffCode,
        trc_c: "3589",
        trc_a: "1726737732",
        trc_b: "973589"
      },
      labelTemplateID: "vcarrier_v3",
      externalID: dropOffCode,
      pickUpCode: generatePickUpCode().toString(),
      dropOffCode: dropOffCode,
    };
  
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('endpoint_cloud_url')}/public/deliveries/reserveLocker`,
      headers: defaultHeadersCloud(),
      body: payload,
      failOnStatusCode: false
    }).its('body._id');
  }