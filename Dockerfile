FROM alpine:latest

# Setup Work directory.
WORKDIR /usr/src/bot
COPY package.json ./
COPY utility/pagination_remove_button_mod.sh utility/str_replace.pl utility/create_support_page_commands_on_demand.sh ./utility/

# Let's install everything!
RUN apk add --update \
    && apk add --no-cache nodejs npm \
    && apk add --no-cache bash \
    && apk add --no-cache perl \
    && apk add --no-cache --virtual .build git curl build-base g++ \
    && npm install \
    && chmod +x ./utility/pagination_remove_button_mod.sh ./utility/str_replace.pl ./utility/create_support_page_commands_on_demand.sh \
    && ./utility/pagination_remove_button_mod.sh \
    && apk del .build

# Copy project to our WORKDIR
COPY . .

# Let's run it!
CMD [ "node", "index.js" ]