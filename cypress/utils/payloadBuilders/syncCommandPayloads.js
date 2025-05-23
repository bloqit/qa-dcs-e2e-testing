import { v4 as uuidv4 } from 'uuid';

export function buildAuthenticateCourierPayload(code = '', bloqId = '') {
  return {
    type: "authenticate_courier",
    payload: {
      code: code,
      sessionId: uuidv4()
    },
    meta: {
      messageId: uuidv4(),
      bloqId: bloqId,
      timestamp: new Date().toISOString(),
      locale: "en"
    }
  };
}

export function buildValidateCodePayload(code = '', bloqId = '') {
    return {
      type: "validate_code",
      payload: {
        code: code,
        context: "dropoff"
      },
      meta: {
        messageId: uuidv4(),
        bloqId: bloqId,
        timestamp: new Date().toISOString(),
        locale: "en",
        courier: {
          id: "333333",
          sessionId: uuidv4()
        }
      }
    };
  }


  export function buildGetAvailableSizesPayload(bloqId = '') {
    return {
      type: "get_available_sizes",
      payload: {
        context: "dropoff"
      },
      meta: {
        messageId: uuidv4(),
        bloqId: bloqId,
        timestamp: new Date().toISOString(),
        locale: "en",
        courier: {
          id: "333333",
          sessionId: uuidv4()
        }
      }
    };
  }

  export function buildActiveDoorPayload(doorId = '', bloqId = '') {
    return {
      type: "activate_door",
      payload: {
        doorId: doorId
      },
      meta: {
        messageId: uuidv4(),
        bloqId: bloqId,
        timestamp: new Date().toISOString(),
        locale: "en",
        technician: {
          id: "171090",
          sessionId: uuidv4()
        }
      }
    };
  }

  export function buildGetConfigPayload(bloqId = '') {
    return {
      type: "get_config",
      payload: {
        bloqId: bloqId
      },
      meta: {
        messageId: uuidv4(),
        bloqId: bloqId,
        timestamp: new Date().toISOString(),
        locale: "en",
      }
    };
}

export function buildValidateLockerIdPayload(bloqId = '') {
  return {
    type: "validate_locker_id",
    payload: {
      bloqId: bloqId
    },
    meta: {
      messageId: uuidv4(),
      bloqId: bloqId,
      timestamp: new Date().toISOString(),
      locale: "en",
    }
  };
}

export function buildSelectDoorPayload(size = '', rentId = '', bloqId = '') {
  return {
    type: "select_door",
    payload: {
      desiredSize: size,
      rentId: rentId,
    },
    meta: {
      messageId: uuidv4(),
      bloqId: bloqId,
      timestamp: new Date().toISOString(),
      locale: "en",
    }
  };
}

export function buildSetBleSecretPayload(value = '', bloqId = '') {
  return {
    type: "set_ble_secret",
    payload: {
      value: value
    },
    meta: {
      messageId: uuidv4(),
      bloqId: bloqId,
      timestamp: new Date().toISOString(),
      locale: "en",
    }
  };
}