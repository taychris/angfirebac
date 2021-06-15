import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@Angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  myArray: any[] = [];
  employeeForm = new FormGroup({
    newName: new FormControl(''),
    newAge: new FormControl('')
  });
  secondForm = new FormGroup({ valueToGet: new FormControl('') })
  editForm = new FormGroup({ replaceValue: new FormControl('') })
  message: string;
  message2: string;
  docs: any;
  person: any;
  id: string = '';
  edit: boolean = false;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.docs = [];
    const collectionRef = this.firestore.collection('Employee');
    const collectionInstance = collectionRef.valueChanges();
    collectionInstance.subscribe(ss => this.myArray = ss);
  }

  onSubmit() {
    let Record = { name: this.employeeForm.value.newName, age: this.employeeForm.value.newAge };
    console.log(Record);

    this.firestore.collection('Employee').add(Record)
    .then(res => {
      this.message = "Employee added successfully.";
      console.log(res);
      this.employeeForm.reset();
    })
    .catch(e => {
      console.log(e);
    })
  }

  onQuery() {
    if (!this.secondForm.value.valueToGet) {
      this.message = 'Cannot be empty';
      this.person = null;
    } else {
      const docRef = this.firestore.collection('Employee', ref => ref.where("name", "==", this.secondForm.value.valueToGet));
      docRef.get()
        .subscribe(ss => {
          if (ss.docs.length === 0) {
            this.message = 'Document not found! Try again!';
            this.person = null;
          } else {
            ss.docs.forEach(doc => {
              this.message = 'Successfully found.';
              this.person = doc.data();
              console.log(this.person);
            })
          }
        })

        docRef.snapshotChanges().forEach((changes) => {
          changes.map((a) => {
            this.id = a.payload.doc.id;
          });
        });
    }
  }

  openEdit() { this.edit = !this.edit};

  onRename() {
    if (!this.editForm.value.replaceValue) {
        this.message2 = "Cannot Be Empty!";
    } else {
        this.firestore.collection('Employee').doc(this.id).update({ name: this.editForm.value.replaceValue });
        this.edit = false;
        this.message2 = '';
        this.person = null;
    }
  }

  delete(){
    if (confirm('Delete?')) {
      this.firestore.collection('Employee').doc(this.id).delete();
      this.edit = false;
      this.person = null;
      this.secondForm.reset();
    }
  }
}
