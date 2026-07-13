import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PermessionRequestService } from '../../services/permession-request.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { PermissionRequest, Status } from '../../entities/PermesionRequest';
import { User } from '../../entities/User';
import { Category } from '../../entities/Category';

@Component({
  selector: 'app-permession-detail',
  standalone: false,
  templateUrl: './permession-detail.component.html',
  styleUrl: './permession-detail.component.css'
})
export class PermessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(PermessionRequestService);
  private categorySrv = inject(CategoryService);
  private authSrv = inject(AuthService);
  private fb = inject(FormBuilder);

  request: PermissionRequest | null = null;
  currentUser: User | null = null;
  categories: Category[] = [];
  loading = true;
  error = '';
  deleting = false;
  confirmDelete = false;
  editMode = false;
  saving = false;

  editForm = this.fb.group({
    categoryDescription: ['' , Validators.required],
    dateStart: ['', Validators.required],
    dateEnd: ['', Validators.required],
    motivation: ['', Validators.required]
  });

  private toInputDate(d?: Date): string {
    if (!d) return '';
    return new Date(d).toISOString().substring(0, 10);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.authSrv.currentUser$.subscribe(u => this.currentUser = u);
    this.categorySrv.categoryList().subscribe(cats => this.categories = cats);
    this.service.getById(id).subscribe({
      next: (data) => {
        this.request = data;
        this.loading = false;
        const catDesc = data.categoryId && typeof data.categoryId === 'object'
          ? (data.categoryId as Category).description
          : '';
        this.editForm.patchValue({
          categoryDescription: catDesc,
          dateStart: this.toInputDate(data.dateStart),
          dateEnd: this.toInputDate(data.dateEnd),
          motivation: data.motivation
        });
      },
      error: () => { this.error = 'Permesso non trovato.'; this.loading = false; }
    });
  }

  get requester(): User | null {
    return this.request?.userIdRequesting && typeof this.request.userIdRequesting === 'object'
      ? (this.request.userIdRequesting as User) : null;
  }

  get category(): Category | null {
    return this.request?.categoryId && typeof this.request.categoryId === 'object'
      ? (this.request.categoryId as Category) : null;
  }

  get approver(): User | null {
    return this.request?.userIdApproving && typeof this.request.userIdApproving === 'object'
      ? (this.request.userIdApproving as User) : null;
  }

  get statusClass(): string {
    switch (this.request?.status) {
      case Status.APPROVED: return 'badge bg-success fs-6';
      case Status.REJECTED: return 'badge bg-danger fs-6';
      default:              return 'badge bg-warning text-dark fs-6';
    }
  }

  goBack() {
    this.router.navigate(['/homepage']);
  }

  onEditToggle() {
    this.editMode = !this.editMode;
    this.error = '';
  }

  onSave() {
    if (this.editForm.invalid || !this.request?.id) return;
    this.saving = true;
    const { categoryDescription, dateStart, dateEnd, motivation } = this.editForm.value;
    const body = {
      categoryDescription: categoryDescription!,
      dateStart: dateStart!,
      dateEnd: dateEnd!,
      motivation: motivation!
    };
    this.service.update(this.request.id, body).subscribe({
      next: (updated) => {
        this.request = updated;
        this.saving = false;
        this.editMode = false;
      },
      error: () => { this.error = 'Errore durante il salvataggio.'; this.saving = false; }
    });
  }

  onDeleteClick() {
    this.confirmDelete = true;
  }

  onDeleteConfirm() {
    const id = this.request?.id;
    if (!id) return;
    this.deleting = true;
    this.service.delete(id).subscribe({
      next: () => this.router.navigate(['/homepage']),
      error: () => { this.error = 'Errore durante la cancellazione.'; this.deleting = false; this.confirmDelete = false; }
    });
  }

  onDeleteCancel() {
    this.confirmDelete = false;
  }

  onApprove() {
    if (!this.request?.id) return;
    this.service.approve(this.request.id).subscribe({
      next: (updated) => { this.request = updated; },
      error: () => { this.error = 'Errore durante l\'approvazione.'; }
    });
  }

  onReject() {
    if (!this.request?.id) return;
    this.service.reject(this.request.id).subscribe({
      next: (updated) => { this.request = updated; },
      error: () => { this.error = 'Errore durante il rifiuto.'; }
    });
  }
}
