import { defaultHeadersDcs } from '../../utils/headers';
import { generateDropOffCode, createRent } from '../../utils/helpers';
import {  
    buildAuthenticateCourierPayload,
    buildValidateCodePayload,
    buildGetAvailableSizesPayload,
    buildGetConfigPayload,
    buildValidateLockerIdPayload,
    buildSelectDoorPayload,
    buildActiveDoorPayload,
    buildSetBleSecretPayload

} from '../../utils/payloadBuilders/syncCommandPayloads';

let dropOffCode = '';
let rentId = '';

describe('INBOUND SYNC COMMAND - Locker To Cloud Commands', () => {

  before(() => {
    dropOffCode = generateDropOffCode().toString();

    createRent(dropOffCode).then((rentIdValue) => {
      rentId = rentIdValue;
    });
  });

  it('Courier Login - Success', () => {
    const payload = buildAuthenticateCourierPayload("333333", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'courier_authentication_result');
        expect(response.body.payload).to.have.property('success', true);
        expect(response.body.meta).to.have.property('courier');
        expect(response.body.meta.courier).to.have.property('id').and.to.be.a('string');
        expect(response.body.meta.courier).to.have.property('sessionId').and.to.be.a('string');
        expect(response.body.meta).to.have.property('timestamp').and.to.match(/\d{4}-\d{2}-\d{2}T/);
      });
    
  });

  it('Courier Login - Failure', () => {
    const payload = buildAuthenticateCourierPayload("555555", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'courier_authentication_result');
        expect(response.body.payload).to.have.property('success', false);
        expect(response.body.meta).to.have.property('messageId').and.to.be.a('string');
        expect(response.body.meta).to.have.property('timestamp').and.to.match(/\d{4}-\d{2}-\d{2}T/);
      });
    
  });

  it('Validate Code - Success', () => {
    const payload = buildValidateCodePayload(dropOffCode, "OLN000011");

    cy.request({
      method: 'POST',
      url: '/inbound/sync/command',
      headers: defaultHeadersDcs(),
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('type', 'code_validation_result');
      expect(response.body.payload).to.have.property('success', true);
      expect(response.body.payload).to.have.property('rents').and.to.be.an('array');

      const rent = response.body.payload.rents[0];

      expect(rent).to.have.property('id').and.to.be.a('string');
      expect(rent).to.have.property('pins').and.to.be.an('array').with.length(1);
      expect(rent.pins[0]).to.match(/^\d{4}$/);
    
      expect(rent).to.have.property('code').and.to.equal(rent.pins[0]);
      expect(rent).to.have.property('dropoffCode').and.to.be.a('string');
      expect(rent).to.have.property('creationDate').and.to.match(/^\d{4}-\d{2}-\d{2}T/);
      expect(rent).to.have.property('pickupPriority').and.to.be.a('number');
      expect(rent).to.have.property('customer').and.to.be.an('object');
      expect(rent).to.have.property('isCourierPickup').and.to.be.a('boolean');
      expect(rent).to.have.property('expiryDate').and.to.match(/^\d{4}-\d{2}-\d{2}T/);
      expect(rent).to.have.property('isLabelless').and.to.be.a('boolean');
      expect(rent).to.have.property('needsPickupVerification').and.to.be.a('boolean');
    });
  });
    
  it('Validate Code - Failure', () => {
    const payload = buildValidateCodePayload("40050422969", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'code_validation_result');
        expect(response.body.payload).to.have.property('success', false);
        expect(response.body.payload).to.have.property('errorMessage', 'codeNotRecognized');
        expect(response.body.payload).to.have.property('error');
        expect(response.body.meta).to.have.property('messageId').and.to.be.a('string');
      });
    
  });

  it('Get Available Sizes - Sizes Available', () => {
    const payload = buildGetAvailableSizesPayload("OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'get_available_sizes_result');
        expect(response.body.payload).to.have.property('availableSizes').and.to.be.an('array');
      });
  });

  it('Get Config - Success', () => {
    const payload = buildGetConfigPayload("OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'set_info');
        expect(response.body.payload.bloq).to.have.property('id').and.to.be.an('string');
        expect(response.body.payload.bloq).to.have.property('doors').and.to.be.an('array');
        expect(response.body.payload.bloq).to.have.property('technicians').and.to.be.an('array');
      });
  });

  it('Validate Locker ID - Success', () => {
    const payload = buildValidateLockerIdPayload("OLN000042");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'validate_locker_id_result');
        expect(response.body.payload).to.have.property('success', true);
        expect(response.body.payload.locationInfo).to.have.property('title').and.to.be.an('string');
        expect(response.body.payload.locationInfo).to.have.property('city').and.to.be.an('string');
        expect(response.body.payload.locationInfo).to.have.property('address').and.to.be.an('string');
        expect(response.body.payload.locationInfo).to.have.property('postalCode').and.to.be.an('string');
      });
  });

  it('Validate Locker ID - Failure', () => {
    const payload = buildValidateLockerIdPayload("OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'validate_locker_id_result');
        expect(response.body.payload).to.have.property('success', false);
      });
  });

  it('Select Door - Disired Door Available', () => {
    
    const payload = buildSelectDoorPayload("M", rentId, "OLN000011");
    cy.request({
      method: 'POST',
      url: '/inbound/sync/command',
      headers: defaultHeadersDcs(),
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('type', 'select_door_result');
      expect(response.body.payload).to.have.property('success', true);
    });
  });

  it('Select Door - Disired Door Unavailable', () => {
    const payload = buildSelectDoorPayload("XL", rentId, "OLN000011");
    cy.request({
      method: 'POST',
      url: '/inbound/sync/command',
      headers: defaultHeadersDcs(),
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('type', 'select_door_result');
      expect(response.body.payload).to.have.property('success', false);
    });
  });

  it('Select Door - Invalid Rent', () => {
    const payload = buildSelectDoorPayload("XL", "682d953f426f9a38d6b1fa72", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'select_door_result');
        expect(response.body.payload).to.have.property('success', false);
      });
  });

  it('Activate Door - Success', () => {
    const payload = buildActiveDoorPayload("1", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('type', 'set_info');
        expect(response.body.payload.door).to.have.property('id').and.to.be.equal('1');
        expect(response.body.payload.door).to.have.property('isActive').and.to.be.equal(true);
      });
  });

  it('Set BLE Secret - Success', () => {
    const payload = buildSetBleSecretPayload("YWJjZGVmZw==", "OLN000011");

    cy.request({
        method: 'POST',
        url: '/inbound/sync/command',
        headers: defaultHeadersDcs(),
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
  });

});
