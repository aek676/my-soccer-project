import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { NewsProviderInterface } from '@core/providers/news-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendFactory } from './backend-factory';
import { SpringCommentProvider } from '@core/providers/spring/spring-comment-provider';
import { SpringNewsProvider } from '@core/providers/spring/spring-news-provider';
import { SpringPlayerProvider } from '@core/providers/spring/spring-player-provider';
import { SpringTeamProvider } from '@core/providers/spring/spring-team-provider';

export class SpringBackend extends BackendFactory {
  public override createPlayerProvider(): PlayerProviderInterface {
    return new SpringPlayerProvider(this.config, this.http);
  }
  public override createTeamProvider(): TeamProviderInterface {
    return new SpringTeamProvider(this.config, this.http);
  }
  public override createCommentProvider(): CommentProviderInterface {
    return new SpringCommentProvider(this.config, this.http);
  }
  public override createNewsProvider(): NewsProviderInterface {
    return new SpringNewsProvider(this.config, this.http);
  }
}
