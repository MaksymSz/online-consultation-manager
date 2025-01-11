import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  private userRole = new BehaviorSubject<string>('');
  currentUserRole$ = this.userRole.asObservable();

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router) {
    this.user$ = afAuth.authState;  // Observable of the current user state
  }

  // Register user with email and password
  async register(email: string, password: string, nickname: string, role: string = 'patient') {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      // Add role to Firestore user document
      await this.firestore.collection('users').doc(user.uid).set({
        role: role,
        nickname: nickname,
      }).catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          console.error('The email address is already in use by another account.');
          return throwError('The email address is already in use. Please choose another email address.');
        }
        return throwError(err.message);
      })
    }

  }

  // Login user with email and password
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Fetch the user's role from Firestore
        const userRoleDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();

        if (userRoleDoc && userRoleDoc.exists) {
          const userData = userRoleDoc.data(); // The document data is expected to have the 'role' field
          // @ts-ignore
          const role = userData?.role || '';  // Safely access the role, default to empty string if not found
          // console.log('Fetched role:', role); // Ensure we are getting the role
          this.userRole.next(role);  // Update the role in the BehaviorSubject
        } else {
          // console.log('User role not found in Firestore');
          this.userRole.next(''); // Set an empty role if no data exists
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }


  // Logout user
  async logout() {
    try {
      await this.afAuth.signOut();  // Signs out the user
      this.userRole.next('');  // Clears the role from the BehaviorSubject
      this.router.navigate(['/login']); // Redirect to the login page after logging out
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // logout() {
  //   this.afAuth.signOut().then(() => {
  //     this.userRole.next('');  // Clear role on logout
  //   });
  // }

  // Get the current user
  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  // Get the user role from Firestore
  getUserRole(userId: string) {
    return this.firestore.collection('users').doc(userId).get();
  }
}
