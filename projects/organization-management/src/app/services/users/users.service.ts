import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

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

  /**
   * Deletes the data of a b2b user. The current user is supposed to have administrator rights.
   * @param login  The login of the user.
   * @returns      The user.
   */
  deleteUser(login: string) {
    if (!login) {
      return throwError('deleteUser() called without customerItemUserKey/login');
    }

    return this.apiService.delete(`customers/-/users/${login}`);
  }
}
