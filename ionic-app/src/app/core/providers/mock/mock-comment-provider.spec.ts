import { MockCommentProvider } from './mock-comment-provider';
import { CommentModel } from '@core/models/comment.model';

// The provider seeds 2 comments for idPlayer '1' on construction
const EXTRA_COMMENT: CommentModel = {
  id: '3',
  author: 'C',
  text: 'Comment 3',
  rating: 3,
  created: 'Jan 3',
  idPlayer: '2',
  idUser: 'u3',
  location: { type: 'Point', coordinates: [2, 2] },
};

describe('MockCommentProvider', () => {
  let provider: MockCommentProvider;

  beforeEach(() => {
    provider = new MockCommentProvider();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getCommentsByPlayer', () => {
    it('should return empty array when no comments match', (done) => {
      provider.getCommentsByPlayer('nonexistent').subscribe((comments) => {
        expect(comments).toEqual([]);
        done();
      });
    });

    it('should return seeded comments for player "1"', (done) => {
      provider.getCommentsByPlayer('1').subscribe((comments) => {
        expect(comments.length).toBe(2);
        expect(comments.every((c) => c.idPlayer === '1')).toBeTrue();
        done();
      });
    });
  });

  describe('createComment', () => {
    it('should add a new comment for a different player', (done) => {
      const newComment: CommentModel = {
        id: '99',
        author: 'D',
        text: 'New',
        rating: 5,
        created: 'Jan 4',
        idPlayer: '99',
        idUser: 'u4',
        location: { type: 'Point', coordinates: [3, 3] },
      };

      provider.createComment(newComment).subscribe((created) => {
        expect(created).toEqual(newComment);
        provider.getCommentsByPlayer('99').subscribe((comments) => {
          expect(comments.length).toBe(1);
          expect(comments[0].id).toBe('99');
          done();
        });
      });
    });
  });

  describe('deleteComment', () => {
    it('should remove a comment by id', (done) => {
      provider.getCommentsByPlayer('1').subscribe((before) => {
        expect(before.length).toBe(2);

        provider.deleteComment('1').subscribe(() => {
          provider.getCommentsByPlayer('1').subscribe((after) => {
            expect(after.length).toBe(1);
            expect(after[0].id).toBe('2');
            done();
          });
        });
      });
    });

    it('should do nothing when id does not exist', (done) => {
      provider.deleteComment('nonexistent').subscribe(() => {
        provider.getCommentsByPlayer('1').subscribe((comments) => {
          expect(comments.length).toBe(2);
          done();
        });
      });
    });
  });
});
