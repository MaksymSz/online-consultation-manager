import {Component, OnInit} from '@angular/core';
import {Rating} from '../../../models/rating';
import { RatingService } from '../../../services/rating.service';

@Component({
  selector: 'app-comments',
  standalone: false,

  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  ratings: Rating[] = [];
  displayedColumns: string[] = ['stars', 'comment', 'patientId', 'consultantId', 'actions'];


  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.fetchRatings();
  }

  // Fetch ratings from Firestore
  fetchRatings(): void {
    this.ratingService.getAllRatings().subscribe(
      (ratings) => {
        this.ratings = ratings;
      },
      (error) => {
        console.error('Error fetching ratings:', error);
      }
    );
  }

  // Delete a rating
  deleteRating(id: string): void {
    this.ratingService.deleteRating(id).then(() => {
      console.log('Rating deleted');
      this.fetchRatings(); // Re-fetch to update the list
    }).catch((error) => {
      console.error('Error deleting rating:', error);
    });
  }
}
