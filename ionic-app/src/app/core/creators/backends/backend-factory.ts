import { HttpClient } from '@angular/common/http';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

// TODO: Cuando el backend esté listo, crear comment-provider real en NodeBackend y SpringBackend
export abstract class BackendFactory {
  constructor(
    protected config: BackendConfigType,
    protected http: HttpClient,
  ) {}
  public abstract createPlayerProvider(): PlayerProviderInterface;
  public abstract createTeamProvider(): TeamProviderInterface;
  public abstract createCommentProvider(): CommentProviderInterface;
}
