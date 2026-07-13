import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../services/category.service';
import { PermessionRequestService } from '../../services/permession-request.service';
import { Category } from '../../entities/Category';

@Component({
  selector: 'app-create-permession-modal',
  standalone: false,
  templateUrl: './create-permession-modal.component.html',
  styleUrl: './create-permession-modal.component.css'
})
export class CreatePermessionModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private categorySrv = inject(CategoryService);
  private permessionSrv = inject(PermessionRequestService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  saving = false;
  error = '';

  form = this.fb.group({
    categoryDescription: ['', Validators.required],
    dateStart: ['', Validators.required],
    dateEnd: ['', Validators.required],
    motivation: ['', Validators.required]
  });

  ngOnInit() {
    this.categorySrv.categoryList().subscribe(cats => this.categories = cats);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const { categoryDescription, dateStart, dateEnd, motivation } = this.form.value;
    this.permessionSrv.create({
      categoryDescription: categoryDescription!,
      dateStart: dateStart!,
      dateEnd: dateEnd!,
      motivation: motivation!
    }).subscribe({
      next: (created) => { this.saving = false; this.activeModal.close(created); },
      error: (err) => { this.error = err.error?.message ?? 'Errore durante la creazione.'; this.saving = false; }
    });
  }
}
