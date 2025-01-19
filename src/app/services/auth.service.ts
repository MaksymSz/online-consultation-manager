import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  public userRole = new BehaviorSubject<string>(''); // Stores the user role
  public userId = new BehaviorSubject<string>(''); // Stores the user role
  currentUserRole$ = this.userRole.asObservable(); // Expose role as observable

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = afAuth.authState;

    // Automatically fetch the role on session restoration
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        // User is logged in, fetch their role
        const userRoleDoc = await this.firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .toPromise();

        // @ts-ignore
        const role = userRoleDoc?.data()?.role || ''; // Safely fetch the role
        this.userRole.next(role); // Update the role in BehaviorSubject
        this.userId.next(user.uid); // Update the role in BehaviorSubject
      } else {
        // User is logged out
        this.userRole.next(''); // Clear the role
      }
    });
  }

  // Register user with email and password
  async register(email: string, password: string, nickname: string, role: string = 'patient') {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Add role to Firestore user document
        await this.firestore.collection('users').doc(user.uid).set({
          role: role,
          nickname: nickname,
        });
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('The email address is already in use.');
        return throwError('The email address is already in use.');
      }
      return throwError(error.message);
    }
    return null;
  }

  // Login user with email and password
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Fetch the user's role from Firestore
        const userRoleDoc = await this.firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .toPromise();

        if (userRoleDoc && userRoleDoc.exists) {
          const userData = userRoleDoc.data(); // Document data
          // @ts-ignore
          const role = userData?.role || ''; // Safely access role
          this.userRole.next(role); // Update BehaviorSubject
        } else {
          this.userRole.next(''); // Default to empty role if not found
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  // Logout user
  async logout() {
    try {
      await this.afAuth.signOut();
      this.userRole.next(''); // Clear role
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Set Firebase Authentication persistence
  setPersistence(persistenceType: string): Promise<void> {
    return this.afAuth.setPersistence(persistenceType.toLowerCase());
  }


  // Get the current user (optional utility function)
  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  async getUserId() {
    const user = await this.afAuth.currentUser;
    return user?.uid || null;
  }


  async registerConsultant(email: string,
                           password: string,
                           nickname: string,
                           specialization: string,
                           role: string = 'consultant',
  ) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Add role to Firestore user document
        await this.firestore.collection('users').doc(user.uid).set({
          role: role,
          nickname: nickname,
          password: password,
        });
        await this.firestore
          .collection('consultants')
          .doc(user.uid).set({
            specialization: specialization,
            name: nickname,
            email: email,
          })
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('The email address is already in use.');
        return throwError('The email address is already in use.');
      }
      return throwError(error.message);
    }
    return null;
  }

  getUserName(){
    return this.firestore
      .collection('users')
      .doc(this.userId.value)
      .valueChanges()
      .pipe(
        map((data: any) => data?.nickname ?? null)
      )
  }
}
