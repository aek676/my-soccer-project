import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendFactory } from './backend-factory';
import { MockCommentProvider } from '@core/providers/mock/mock-comment-provider';
import { NodePlayerProvider } from '@core/providers/node/node-player-provider';
import { SpringTeamProvider } from '@core/providers/spring/spring-team-provider';

export class NodeBackend extends BackendFactory {
  public override createPlayerProvider(): PlayerProviderInterface {
    return new NodePlayerProvider(this.config, this.http);
  }
  public override createTeamProvider(): TeamProviderInterface {
    return new SpringTeamProvider(this.config, this.http);
  }
  // TODO: Reemplazar MockCommentProvider por NodeCommentProvider cuando el backend esté listo
  public override createCommentProvider(): CommentProviderInterface {
    return new MockCommentProvider();
  }
}
