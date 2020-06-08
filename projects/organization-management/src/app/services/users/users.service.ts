import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CustomerUserType } from 'ish-core/models/customer/customer.model';
import { Link } from 'ish-core/models/link/link.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets all users of a customer. The current user is supposed to have administrator rights.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get(`customers/-/users`).pipe(
      unpackEnvelope<Link>(),
      this.apiService.resolveLinks<UserData>(),
      map(users => users.map(UserMapper.fromData))
    );
  }

  /**
   * Gets the data of a b2b user. The current user is supposed to have administrator rights.
   * @param login  The login of the user.
   * @returns      The user.
   */
  getUser(login: string): Observable<User> {
    return this.apiService.get(`customers/-/users/${login}`).pipe(map(UserMapper.fromData));
  }

  deleteUser(customerItemUserKey: string) {
    if (!customerItemUserKey) {
      return throwError('deleteUser() called without customerItemUserKey');
    }

    return this.apiService.delete(`customers/-/users/${customerItemUserKey}`);
  }

  addUser(body: CustomerUserType): Observable<User[]> {
    if (!body || !body.customer || !body.user) {
      return throwError('addUser() called without required body data');
    }

    return this.apiService
      .post<User>(`customers/${body.customer.customerNo}/users`, {
        type: 'SMBCustomerUserCollection',
        name: 'Users',
        elements: [
          {
            ...body.customer,
            ...body.user,
            preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
            preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
            preferredPaymentInstrument: { id: body.user.preferredPaymentInstrumentId },
            preferredInvoiceToAddressUrn: undefined,
            preferredShipToAddressUrn: undefined,
            preferredPaymentInstrumentId: undefined,
          },
        ],
      })
      .pipe(
        unpackEnvelope<Link>(),
        this.apiService.resolveLinks<UserData>(),
        map(users => users.map(UserMapper.fromData))
      );
  }

  updateUser(customerItemUserKey: string, body: CustomerUserType): Observable<User> {
    if (!body || !body.customer || !body.user) {
      return throwError('updateUser() called without required body data');
    }

    return this.apiService
      .put<User>(`customers/${body.customer.customerNo}/users/${customerItemUserKey}`, {
        ...body.customer,
        ...body.user,
        preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
        preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
        preferredPaymentInstrument: { id: body.user.preferredPaymentInstrumentId },
        preferredInvoiceToAddressUrn: undefined,
        preferredShipToAddressUrn: undefined,
        preferredPaymentInstrumentId: undefined,
      })
      .pipe(map(UserMapper.fromData));
  }
}
