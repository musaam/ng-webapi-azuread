import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import { AdalService } from './adal.service';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/operator/mergeMap';

/**
 * 
 * 
 * @export
 * @class AdalHTTPService
 */
@Injectable()
export class AdalHTTPService {

  /**
   * 
   * 
   * @static
   * @param {Http} http 
   * @param {AdalService} service 
   * 
   * @memberOf AdalHTTPService
   */
  static factory(http: Http, service: AdalService) {
    return new AdalHTTPService(http, service);
  }

  /**
   * Creates an instance of AdalHTTPService.
   * @param {Http} http 
   * @param {AdalService} service 
   * 
   * @memberOf AdalHTTPService
   */
  constructor(
    private http: Http,
    private service: AdalService
  ) { }

  /**
   * 
   * 
   * @param {string} url 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Get });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {*} body 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Post, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Delete });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {*} body 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Patch, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {*} body 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Put, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {RequestOptionsArgs} [options] 
   * @returns {Observable<any>} 
   * 
   * @memberOf AdalHTTPService
   */
  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Put });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   * 
   * 
   * @private
   * @param {string} url 
   * @param {RequestOptionsArgs} options 
   * @returns {Observable<string>} 
   * 
   * @memberOf AdalHTTPService
   */
  private sendRequest(url: string, options: RequestOptionsArgs): Observable<string> {
    //make a copy
    let options1 = new RequestOptions();
    options1.method = options.method;
    options1 = options1.merge(options);

    let resource = this.service.GetResourceForEndpoint(url);
    let authenticatedCall: Observable<string>;
    if (resource) {
      if (this.service.userInfo.authenticated) {
        authenticatedCall = this.service.acquireToken(resource)
          .flatMap((token: string) => {
            if (options1.headers == null) {
              options1.headers = new Headers();
            }
            options1.headers.append('Authorization', 'Bearer ' + token);
            return this.http.request(url, options1)
              .catch(this.handleError);
          });
      }
      else {
        authenticatedCall = Observable.throw(new Error("User Not Authenticated."));
      }
    }
    else {
      authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError);
    }

    return authenticatedCall;
  }

  /**
   * 
   * 
   * @private
   * @param {Response} res 
   * @returns 
   * 
   * @memberOf AdalHTTPService
   */
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }

    var body = {};
    //if there is some content, parse it
    if (res.status != 204) {
      body = res.json();
    }

    return body || {};
  }

  /**
   * 
   * 
   * @private
   * @param {*} error 
   * @returns 
   * 
   * @memberOf AdalHTTPService
   */
  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(JSON.stringify(error)); // log to console instead

    return Observable.throw(error);
  }
}