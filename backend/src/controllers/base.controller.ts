import { IBaseController, IResponse } from '../interfaces';

export abstract class BaseController implements IBaseController {
  data: any;
  res: any;

  constructor(data: any, resource: { res: any; }) {
    this.data = data;
    this.res = resource.res;
  }

  handleSuccess(status: number = 200, response: IResponse = {}) {
    const { message, data } = response;

    response = {
      ...response,
      message: message || 'Success',
      data: data || 1,
      code: status,
      success: true,
      status: 'success',
    };

    return this.res.status(status).send(response);
  }

  handleError(status: number = 500, response: IResponse = {}) {
    const { message, error } = response;

    response = {
      ...response,
      message: message || 'Internal Server Error',
      error: error || 0,
      code: status,
      success: false,
      status: 'error',
    };

    return this.res.status(status).send(response);
  }

}


