class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;

    await this._commentRepository.verifyCommentIsExist({ commentId, threadId });
    await this._commentRepository.verifyCommentAccess({ commentId, owner: userId });
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
