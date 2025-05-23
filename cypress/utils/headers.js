export function defaultHeadersDcs() {
    return {
      'x-api-key': Cypress.env('api_key_dcs'),
      'Content-Type': 'application/json'
    };
  }


export function defaultHeadersCloud() {
    return {
      'x-api-key': Cypress.env('api_key_cloud'),
      'Content-Type': 'application/json'
    };
  }
  