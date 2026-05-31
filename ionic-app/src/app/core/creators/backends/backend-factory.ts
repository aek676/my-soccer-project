import { HttpClient } from '@angular/common/http';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { NewsProviderInterface } from '@core/providers/news-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

export abstract class BackendFactory {
  constructor(
    protected config: BackendConfigType,
    protected http: HttpClient,
  ) {}
  public abstract createPlayerProvider(): PlayerProviderInterface;
  public abstract createTeamProvider(): TeamProviderInterface;
  public abstract createCommentProvider(): CommentProviderInterface;
  public abstract createNewsProvider(): NewsProviderInterface;
}
