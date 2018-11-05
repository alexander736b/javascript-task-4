'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let eventsStudents = {};

    function addEvent(event, context, handler, performEvent) {
        if (eventsStudents[event] === undefined) {
            eventsStudents[event] = [];
        }

        eventsStudents[event].push({
            context,
            handler,
            index: 0,
            performEvent
        });
    }

    function getActiveEvents(event) {
        const activeEvents = [event];
        const expression = event.split('.');

        for (let i = 1; i < expression.length; i++) {
            const a = expression.slice(0, expression.length - i);
            activeEvents.push(a.join('.'));
        }

        return activeEvents;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            const usualyPerformEvent = function () {
                return true;
            };

            addEvent(event, context, handler, usualyPerformEvent);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            if (eventsStudents[event] === undefined) {
                return this;
            }

            const nameEvents = Object.keys(eventsStudents);

            nameEvents.forEach(element => {
                if (element.startsWith(event)) {
                    eventsStudents[event] = eventsStudents[event].filter(value =>
                        value.context !== context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const activeEvents = getActiveEvents(event);
            const nameEvents = Object.keys(eventsStudents);

            for (let i = 0; i < activeEvents.length; i++) {
                nameEvents.forEach(element => {
                    if (element === activeEvents[i]) {
                        eventsStudents[element].forEach(value => {
                            if (value.performEvent()) {
                                value.handler.call(value.context);
                            }

                            value.index++;
                        });
                    }
                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            const performEventTimes = function () {
                if (this.index >= times) {
                    return false;
                }

                return true;
            };

            if (times <= 0) {
                return this.on(event, context, handler);
            }

            addEvent(event, context, handler, performEventTimes);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            const performEventFrequency = function () {
                if (this.index % frequency !== 0) {
                    return false;
                }

                return true;
            };

            if (frequency <= 0) {
                return this.on(event, context, handler);
            }

            addEvent(event, context, handler, performEventFrequency);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
